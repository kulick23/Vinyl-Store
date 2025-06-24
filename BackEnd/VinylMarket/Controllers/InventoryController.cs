using BLL.DTO;
using BLL.Services;
using DAL.Interfaces;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using System.Security.Claims;

namespace VinylMarket.Controllers;

[Authorize]
[ApiController]
[Route("api/inventory")]
public sealed class InventoryController : ControllerBase
{
    private readonly IInventoryService _inventory;
    private readonly ISellerProfileRepository _sellers;

    public InventoryController(
        IInventoryService inventory,
        ISellerProfileRepository sellers)
    {
        _inventory = inventory;
        _sellers = sellers;
    }
    private async Task<int> GetSellerProfileIdAsync(CancellationToken ct)
    {
        int customerId = int.Parse(
            User.FindFirstValue(ClaimTypes.NameIdentifier)
            ?? throw new InvalidOperationException("JWT has no sub"));

        var profile = await _sellers.Query()
                          .FirstOrDefaultAsync(s => s.CustomerId == customerId, ct);

        return profile?.Id
               ?? throw new InvalidOperationException(
                      "You must create a seller profile first.");
    }


    [HttpGet]
    public async Task<IActionResult> GetAllListings(CancellationToken ct = default)
    {
        int sellerId = await GetSellerProfileIdAsync(ct);
        var list = await _inventory.GetSellerListingsAsync(sellerId, ct);
        return Ok(list);
    }

    [HttpGet("{id:int}")]
    public async Task<IActionResult> GetListingDetails(int id, CancellationToken ct = default)
    {
        var dto = await _inventory.GetListingAsync(id, ct);
        return dto is null ? NotFound() : Ok(dto);
    }


    [HttpPost]
    public async Task<IActionResult> CreateListing(
        [FromBody] InventoryItemCreateDto dto,
        CancellationToken ct = default)
    {
        int sellerId = await GetSellerProfileIdAsync(ct);

        var created = await _inventory.CreateListingAsync(sellerId, dto, ct);

        return CreatedAtAction(nameof(GetListingDetails),
                               new { id = created.Id },
                               created);
    }


    [HttpPut("{id:int}")]
    public async Task<IActionResult> UpdateListingFull(
        int id,
        [FromBody] InventoryItemCreateDto dto,
        CancellationToken ct = default)
    {
        int sellerId = await GetSellerProfileIdAsync(ct);

        var upd = new InventoryItemUpdateDto(
                      dto.Price,
                      dto.Quantity,
                      dto.Condition,
                      dto.Notes,
                      null);

        await _inventory.UpdateListingAsync(sellerId, id, upd, ct);
        return NoContent();
    }

    [HttpPatch("{id:int}")]
    public async Task<IActionResult> UpdateListingPartial(
        int id,
        [FromBody] InventoryItemUpdateDto dto,
        CancellationToken ct = default)
    {
        int sellerId = await GetSellerProfileIdAsync(ct);
        await _inventory.UpdateListingAsync(sellerId, id, dto, ct);
        return NoContent();
    }

    [HttpDelete("{id:int}")]
    public async Task<IActionResult> ArchiveListing(int id, CancellationToken ct = default)
    {
        int sellerId = await GetSellerProfileIdAsync(ct);
        await _inventory.ArchiveListingAsync(sellerId, id, ct);
        return NoContent();
    }
}
