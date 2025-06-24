using System.Collections.Generic;
using System.Threading;
using System.Threading.Tasks;
using BLL.DTO;
using BLL.DTO;

namespace BLL.Services
{
    public interface ICatalogService
    {
        Task<PagedResultDto<ReleaseDto>> SearchReleasesAsync(SearchQueryDto query, int page = 1, int pageSize = 20, CancellationToken ct = default);
        Task<ReleaseDetailsDto?> GetReleaseAsync(int releaseId, CancellationToken ct = default);
        Task<IReadOnlyList<InventoryItemDto>> GetListingsForReleaseAsync(int releaseId, SortOption sortBy, CancellationToken ct = default);
        Task<IReadOnlyList<GenreDto>> GetGenresAsync(CancellationToken ct = default);
        Task<IReadOnlyList<ArtistDto>> GetArtistsAsync(CancellationToken ct = default);
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
