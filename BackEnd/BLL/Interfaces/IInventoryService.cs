using System.Collections.Generic;
using System.Threading;
using System.Threading.Tasks;
using Application.DTOs;

namespace Application.Services
{
    public interface IInventoryService
    {
        Task<InventoryItemDto> CreateListingAsync(int sellerId, InventoryItemCreateDto dto, CancellationToken ct = default);
        Task UpdateListingAsync(int sellerId, int listingId, InventoryItemUpdateDto dto, CancellationToken ct = default);
        Task ArchiveListingAsync(int sellerId, int listingId, CancellationToken ct = default);
        Task<IReadOnlyList<InventoryItemDto>> GetSellerListingsAsync(int sellerId, CancellationToken ct = default);
        Task<InventoryItemDto?> GetListingAsync(int listingId, CancellationToken ct = default);
    }
}
