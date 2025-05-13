using Application.DTOs;
using Application.Services;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using System.IdentityModel.Tokens.Jwt;

namespace VinylMarket.Controllers
{
    [ApiController]
    [Authorize(Roles = "Seller")]
    [Route("api/inventory")]
    public class InventoryController : Controller
    {
        private readonly IInventoryService _inventory;

        public InventoryController(IInventoryService inventoryService)
        {
            _inventory = inventoryService;
        }
        private int GetSellerId()
        {
            var sub = User.FindFirst(JwtRegisteredClaimNames.Sub)?.Value
                      ?? throw new InvalidOperationException("User ID not found in token");
            return int.Parse(sub);
        }

        [HttpGet]
        [Authorize(Roles = "Seller")]
        public async Task<IActionResult> GetAllListings(CancellationToken ct = default)
        {
            var sellerId = GetSellerId();

            var listings = await _inventory.GetSellerListingsAsync(sellerId, ct);
            return Ok(listings);
        }

        [HttpGet("{id:int}")]
        public async Task<IActionResult> GetListingDetails(
            int id,
            CancellationToken ct = default)
        {
            var listing = await _inventory.GetListingAsync(id, ct);
            if (listing is null)
                return NotFound();
            return Ok(listing);
        }

        [HttpPost]
        public async Task<IActionResult> CreateListing(
            [FromBody] InventoryItemCreateDto dto,
            CancellationToken ct = default)
        {
            var sellerId = GetSellerId();
            var created = await _inventory.CreateListingAsync(sellerId, dto, ct);
                
            return CreatedAtAction(
                nameof(GetListingDetails),
                new { id = created.Id },
                created
            );
        }

        [HttpDelete("{id:int}")]
        public async Task<IActionResult> ArchiveListing(
            int id,
            CancellationToken ct = default)
        {
            var sellerId = GetSellerId();
            await _inventory.ArchiveListingAsync(sellerId, id, ct);

            return NoContent();
        }

        [HttpPut("{id:int}")]
        public async Task<IActionResult> UpdateListingFull(
            int id,
            [FromBody] InventoryItemCreateDto dto,
            CancellationToken ct = default)
        {
            var sellerId = GetSellerId();

            var updateDto = new InventoryItemUpdateDto(
                dto.Price,
                dto.Quantity,
                dto.Condition,
                dto.Notes,
                null
            );
            await _inventory.UpdateListingAsync(sellerId, id, updateDto, ct);
            return NoContent();
        }

        [HttpPatch("{id:int}")]
        public async Task<IActionResult> UpdateListingPartial(
            int id,
            [FromBody] InventoryItemUpdateDto dto,
            CancellationToken ct = default)
        {
            var sellerId = GetSellerId();
            await _inventory.UpdateListingAsync(sellerId, id, dto, ct);
            return NoContent();
        }
    }
}
