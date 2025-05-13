using Application.DTOs;
using Application.Services;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using System.IdentityModel.Tokens.Jwt;
using System.Security.Claims;

namespace Web.Api.Controllers
{
    [ApiController]
    [Authorize]
    [Route("api/[controller]")]
    public class CartController : ControllerBase
    {
        private readonly ICartService _cartService;

        public CartController(ICartService cartService)
        {
            _cartService = cartService;
        }

        private int GetUserId()
        {
            var val = User.FindFirst(ClaimTypes.NameIdentifier)?.Value
                      ?? throw new InvalidOperationException("User ID not found in token");
            return int.Parse(val);
        }


        [HttpGet]
        public async Task<IActionResult> GetCart(CancellationToken ct = default)
        {
            var userId = GetUserId();
            var cart = await _cartService.GetCartAsync(userId, ct);
            return Ok(cart);
        }

        [HttpPost("items")]
        public async Task<IActionResult> AddItem(
            [FromBody] AddCartItemDto dto,
            CancellationToken ct = default)
        {
            var userId = GetUserId();
            await _cartService.AddItemAsync(userId, dto.InventoryItemId, dto.Quantity, ct);
            return NoContent();
        }

        [HttpPatch("items/{itemId:int}")]
        public async Task<IActionResult> UpdateItem(
            int itemId,
            [FromBody] UpdateCartItemDto dto,
            CancellationToken ct = default)
        {
            var userId = GetUserId();
            await _cartService.UpdateQuantityAsync(userId, itemId, dto.Quantity, ct);
            return NoContent();
        }

        [HttpDelete("items/{itemId:int}")]
        public async Task<IActionResult> RemoveItem(
            int itemId,
            CancellationToken ct = default)
        {
            var userId = GetUserId();
            await _cartService.RemoveItemAsync(userId, itemId, ct);
            return NoContent();
        }

        [HttpDelete]
        public async Task<IActionResult> ClearCart(CancellationToken ct = default)
        {
            var userId = GetUserId();
            await _cartService.ClearAsync(userId, ct);
            return NoContent();
        }

        [HttpPost("merge")]
        public async Task<IActionResult> MergeGuestCart(
            [FromBody] IEnumerable<GuestCartItemDto> guestItems,
            CancellationToken ct = default)
        {
            var userId = GetUserId();
            await _cartService.MergeGuestCartAsync(userId, guestItems, ct);
            return NoContent();
        }
    }

    public record AddCartItemDto(int InventoryItemId, int Quantity);

    public record UpdateCartItemDto(int Quantity);
}