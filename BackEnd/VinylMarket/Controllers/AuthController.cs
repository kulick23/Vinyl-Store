using System.IdentityModel.Tokens.Jwt;
using System.Security.Claims;
using System.Threading;
using System.Threading.Tasks;
using Application.DTOs;
using Application.Services;
using BLL.DTOs;
using BLL.Interfaces;
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

        public AuthController(IAccountService account, IWishlistService wishlistService)
        {
            _account = account;
            _wishlistService = wishlistService;
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
    }
}
