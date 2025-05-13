using System.Threading;
using System.Threading.Tasks;
using Application.DTOs;
using Application.Services;
using Microsoft.AspNetCore.Mvc;

namespace Web.Api.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class SellerController : ControllerBase
    {
        private readonly ISellerProfileService _sellerService;

        public SellerController(ISellerProfileService sellerService)
        {
            _sellerService = sellerService;
        }

        [HttpGet("{sellerId:int}")]
        public async Task<IActionResult> GetPublicSellerProfile(
            int sellerId,
            CancellationToken ct = default)
        {
            var profile = await _sellerService.GetProfileAsync(sellerId, ct);
            return profile is null
                ? NotFound()
                : Ok(profile);
        }
    }
}
