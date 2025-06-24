using System.Security.Claims;
using System.Threading;
using System.Threading.Tasks;
using Application.DTOs;
using Application.Services;
using DAL.Interfaces;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace Web.Api.Controllers
{
    [Authorize]
    [ApiController]
    [Route("api/[controller]")]
    public class SellerController : ControllerBase
    {
        private readonly ISellerProfileService _sellerService;


        public SellerController(ISellerProfileService sellerService)
        {
            _sellerService = sellerService;
        }

        [AllowAnonymous]
        [HttpGet("{id:int}")]
        public async Task<IActionResult> GetPublicSellerProfile(
            int id,
            CancellationToken ct = default)
        {
            var profile = await _sellerService.GetProfileAsync(id, ct);
            return profile is null
                ? NotFound()
                : Ok(profile);
        }

        [HttpPost("becomeSeller")]
        public async Task<IActionResult> BecomeSellerAsync(
            [FromBody] SellerProfileCreateDto dto,
            CancellationToken ct = default)
        {
            int userId = int.Parse(User.FindFirstValue(ClaimTypes.NameIdentifier)!);

            var profile = await _sellerService.CreateProfileAsync(userId, dto, ct);
            return RedirectToAction(
                    nameof(GetPublicSellerProfile),
                    new { id = profile.CustomerId });
        }


        [HttpPut("avatar")]
        public async Task<IActionResult> UploadSellerAvatar(
    IFormFile file,
    [FromServices] IImageStore store,
    [FromServices] ISellerProfileRepository repo,
    [FromServices] IUnitOfWork unitOfWork,
    CancellationToken ct = default)
        {
            int userId = int.Parse(User.FindFirstValue(ClaimTypes.NameIdentifier)!);

            var profile = repo.Query()
                    .FirstOrDefault(s => s.CustomerId == userId)
                         ?? throw new InvalidOperationException("Become seller first");

            if (!string.IsNullOrEmpty(profile.AvatarPath))
                await store.DeleteAsync(profile.AvatarPath);

            profile.AvatarPath = await store.SaveImageAsync(file, "avatars", 256, ct);
            await unitOfWork.SaveChangesAsync(ct);

            return Ok(new { profile.AvatarPath });
        }

    }
}
