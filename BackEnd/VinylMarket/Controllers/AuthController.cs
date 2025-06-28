using System.IdentityModel.Tokens.Jwt;
using System.Security.Claims;
using System.Threading;
using System.Threading.Tasks;
using BLL.DTO;
using BLL.Services;
using BLL.DTO;
using Google.Apis.Auth;
using BLL.Interfaces;
using DAL.Interfaces;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace VinylMarket.Controllers
{
    [ApiController]
    [Route("api/auth")]
    public class AuthController : ControllerBase
    {
        private readonly IAccountService _account;
        private readonly IWishlistService _wishlistService;
        private readonly IConfiguration _config;

        public AuthController(
            IAccountService account,
            IWishlistService wishlistService,
            IConfiguration config)
        {
            _account = account;
            _wishlistService = wishlistService;
            _config = config;
        }

        [HttpPost("register")]
        public async Task<IActionResult> Register(
            [FromBody] RegisterDto dto,
            CancellationToken ct)
        {
            var tokens = await _account.RegisterAsync(dto, ct);
            return Ok(tokens);
        }


        [HttpPost("login")]
        public async Task<IActionResult> Login(
            [FromBody] LoginDto dto,
            CancellationToken ct)
        {
            var tokens = await _account.LoginAsync(dto, ct);
            return Ok(tokens);
        }

        [HttpGet("myAccount")]
        public async Task<IActionResult> MyAccountInfo(CancellationToken ct)
        {
            int userId = int.Parse(User.FindFirstValue(ClaimTypes.NameIdentifier)!);
            if (userId is 0)
            {
                throw new UnauthorizedAccessException("No sub claim");
            }

            var user = await _account.GetByIdAsync(userId, ct);

            return Ok(user);
        }

        [HttpGet("wishlist")]
        public async Task<IActionResult> GetMyWishlist(CancellationToken ct)
        {
            int userId = int.Parse(User.FindFirstValue(ClaimTypes.NameIdentifier)!);
            if (userId is 0)
            {
                throw new UnauthorizedAccessException("No sub claim");
            }

            var list = await _wishlistService.GetWishlistAsync(userId, ct);
            return Ok(list);
        }

        [HttpPost("wishlist/{releaseId:int}")]
        public async Task<IActionResult> Add(int releaseId, CancellationToken ct)
        {
            int userId = int.Parse(User.FindFirstValue(ClaimTypes.NameIdentifier)!);
            if (userId is 0)
            {
                throw new UnauthorizedAccessException("No sub claim");
            }

            await _wishlistService.AddAsync(userId, releaseId, ct);
            return NoContent();
        }

        [HttpDelete("wishlist/{releaseId:int}")]
        public async Task<IActionResult> Remove(int releaseId, CancellationToken ct)
        {
            int userId = int.Parse(User.FindFirstValue(ClaimTypes.NameIdentifier)!);
            if (userId is 0)
            {
                throw new UnauthorizedAccessException("No sub claim");
            }
            await _wishlistService.RemoveAsync(userId, releaseId, ct);
            return NoContent();
        }


        [HttpPost("editProfile")]
        public async Task<IActionResult> EditProfile(
        [FromBody] CustomerUpdateDto dto,
        CancellationToken ct)
        {
            int userId = int.Parse(
                User.FindFirstValue(ClaimTypes.NameIdentifier)
                ?? throw new UnauthorizedAccessException("No id"));

            var updated = await _account.UpdateProfileAsync(userId, dto, ct);
            return Ok(updated);
        }

        [Authorize]
        [HttpPut("account/avatar")]
        public async Task<IActionResult> UploadAvatar(
        IFormFile file,
        [FromServices] IImageStore store,
        [FromServices] IAccountRepository accRepo,
        [FromServices] IUnitOfWork unitOfWork,
        CancellationToken ct = default)
        {
            int userId = int.Parse(User.FindFirstValue(ClaimTypes.NameIdentifier)!);
            var user = await accRepo.GetByIdAsync(userId, ct) ?? throw new KeyNotFoundException();

            if (!string.IsNullOrEmpty(user.AvatarPath))
                await store.DeleteAsync(user.AvatarPath);

            user.AvatarPath = await store.SaveImageAsync(file, "avatars", 256, ct);
            await unitOfWork.SaveChangesAsync(ct);

            return Ok(new { user.AvatarPath });
        }

        [HttpPost("refresh")]
        public async Task<IActionResult> Refresh(
            [FromBody] string refreshToken,
            CancellationToken ct)
        {
            var tokens = await _account.RefreshAsync(refreshToken, ct);
            return Ok(tokens);
        }

        [AllowAnonymous]
        [HttpPost("confirm")]
        public async Task<IActionResult> ConfirmEmail([FromBody] string token, CancellationToken ct)
        {
            var ok = await _account.ConfirmEmailAsync(token, ct);
            return ok ? Ok("E-mail confirmed") : BadRequest("Invalid or expired token");
        } 

        [HttpPost("google")]
        [AllowAnonymous]
        public async Task<IActionResult> GoogleLogin(
            [FromBody] GoogleAuthDto dto,
            CancellationToken ct)
        {
            var payload = await VerifyGoogleToken(dto.IdToken);
            if (payload == null)
                return BadRequest("Invalid Google token");

            var email = payload.Email;
            if (string.IsNullOrEmpty(email))
                return BadRequest("Google token does not contain email");

            var user = await _account.GetUserByEmailAsync(email, ct);

            if (user == null)
            {
                user = await _account.RegisterGoogleUserAsync(
                    email: email,
                    firstName: payload.GivenName ?? "",
                    lastName: payload.FamilyName ?? "",
                    ct: ct
                );
            }
            else if (!string.IsNullOrEmpty(user.PasswordHash))
            {
                return BadRequest("Email already registered with password");
            }

            var tokens = await _account.GenerateTokensForUserAsync(user, ct);
            return Ok(tokens);
        }

        private async Task<GoogleJsonWebSignature.Payload?> VerifyGoogleToken(string idToken)
        {
            try
            {
                return await GoogleJsonWebSignature.ValidateAsync(
                    idToken,
                    new GoogleJsonWebSignature.ValidationSettings
                    {
                        Audience = new[] { _config["Authentication:Google:ClientId"] }
                    });
            }
            catch
            {
                return null;
            }
        }
    }
}