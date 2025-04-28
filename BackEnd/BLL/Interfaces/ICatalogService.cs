using System.Collections.Generic;
using System.Threading;
using System.Threading.Tasks;
using Application.DTOs;

namespace Application.Services
{
    public interface ICatalogService
    {
        Task<IReadOnlyList<ReleaseDto>> SearchReleasesAsync(SearchQueryDto query, CancellationToken ct = default);
        Task<ReleaseDetailsDto?> GetReleaseAsync(int releaseId, CancellationToken ct = default);
        Task<IReadOnlyList<InventoryItemDto>> GetListingsForReleaseAsync(int releaseId, SortOption sortBy, CancellationToken ct = default);
    }

    public enum SortOption
    {
        PriceAsc,
        PriceDesc,
        Condition,
        SellerRating,
        Newest
    }
}
