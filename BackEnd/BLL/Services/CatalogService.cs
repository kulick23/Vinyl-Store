using System.Collections.Generic;
using System.Linq;
using System.Threading;
using System.Threading.Tasks;
using Application.DTOs;
using Application.Services;
using AutoMapper;
using BLL.DTO;
using DAL.Interfaces;
using Domain.Entities;
using Microsoft.EntityFrameworkCore;

namespace Application.Services.Implementation
{
    public class CatalogService : ICatalogService
    {
        private readonly IRecordReleaseRepository _releaseRepo;
        private readonly IInventoryItemRepository _inventoryRepo;
        private readonly IGenreRepository _genreRepo;
        private readonly IArtistRepository _artistRepo;
        private readonly IMapper _mapper;

        public CatalogService(IRecordReleaseRepository releaseRepo,
                              IInventoryItemRepository inventoryRepo,
                              IGenreRepository genreRepo,
                              IArtistRepository artistRepo,
                              IMapper mapper)
        {
            _releaseRepo = releaseRepo;
            _inventoryRepo = inventoryRepo;
            _genreRepo = genreRepo;
            _artistRepo = artistRepo;
            _mapper = mapper;
        }

        public async Task<IReadOnlyList<ReleaseDto>> SearchReleasesAsync(SearchQueryDto query, CancellationToken ct = default)
        {
            var releases = _releaseRepo.Query();

            if (!string.IsNullOrWhiteSpace(query.Keyword))
                releases = releases.Where(r => r.Title.Contains(query.Keyword));

            if (query.ArtistId.HasValue)
                releases = releases.Where(r => r.ArtistId == query.ArtistId);

            if (query.GenreId.HasValue)
                releases = releases.Where(r => r.GenreId == query.GenreId);

            if (query.YearFrom.HasValue)
                releases = releases.Where(r => r.Year >= query.YearFrom);

            if (query.YearTo.HasValue)
                releases = releases.Where(r => r.Year <= query.YearTo);

            var list = await releases
                .AsNoTracking()
                .Take(100)
                .ToListAsync(ct);

            return _mapper.Map<IReadOnlyList<ReleaseDto>>(list);
        }

        public async Task<ReleaseDetailsDto?> GetReleaseAsync(int releaseId, CancellationToken ct = default)
        {
            var release = await _releaseRepo.Query()
                           .Include(r => r.Artist)
                           .Include(r => r.Genre)
                           .FirstOrDefaultAsync(r => r.Id == releaseId, ct);

            if (release is null) return null;

            var listings = await _inventoryRepo.Query()
                             .Where(i => i.ReleaseId == releaseId && i.Quantity > 0)
                             .Include(i => i.Seller)
                             .ThenInclude(s => s.Customer)
                             .ToListAsync(ct);

            return new ReleaseDetailsDto(
                _mapper.Map<ReleaseDto>(release),
                _mapper.Map<IReadOnlyList<InventoryItemDto>>(listings));
        }

        public async Task<IReadOnlyList<InventoryItemDto>> GetListingsForReleaseAsync( int releaseId, SortOption sortBy, CancellationToken ct = default)
        {
            IQueryable<InventoryItem> query = _inventoryRepo.Query()
                .Where(i => i.ReleaseId == releaseId && i.Quantity > 0)
                .Include(i => i.Seller);

            query = sortBy switch
            {
                SortOption.PriceAsc => query.OrderBy(i => i.Price),
                SortOption.PriceDesc => query.OrderByDescending(i => i.Price),
                SortOption.SellerRating => query.OrderByDescending(i => i.Seller.Rating),
                SortOption.Condition => query.OrderBy(i => i.Condition),
                SortOption.Newest => query.OrderByDescending(i => i.CreatedAt),
                _ => query
            };

            var list = await query.ToListAsync(ct);
            return _mapper.Map<IReadOnlyList<InventoryItemDto>>(list);
        }

        public async Task<IReadOnlyList<GenreDto>> GetGenresAsync(CancellationToken ct = default)
        {
            var list = await _genreRepo.Query()
                .AsNoTracking()
                .ToListAsync(ct);
            
            return _mapper.Map<IReadOnlyList<GenreDto>>(list);
        }

        public async Task<IReadOnlyList<ArtistDto>> GetArtistsAsync(CancellationToken ct = default)
        {
            var list = await _artistRepo.Query()
                .AsNoTracking()
                .ToListAsync(ct);
            return _mapper.Map<IReadOnlyList<ArtistDto>>(list);
        }

    }
}
