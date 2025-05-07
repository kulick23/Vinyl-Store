using Application.DTOs;
using Application.Services;
using BLL.Interfaces;
using Domain.Entities;
using Microsoft.AspNetCore.Mvc;

namespace VinylMarket.Controllers
{
    [ApiController]
    [Route("api/catalog")]
    public class CatalogController : Controller
    {
        private readonly ICatalogService _catalog;
        public CatalogController(ICatalogService catalog)
        {
            _catalog = catalog;
        }
        [HttpGet("genres")]
        public async Task<IActionResult> GetAllGenres(CancellationToken ct = default)
        {
            var genres = await _catalog.GetGenresAsync(ct);
            return Ok(genres);
        }
        [HttpGet("artists")]
        public async Task<IActionResult> GetAllArtists(CancellationToken ct = default)
        {
            var artists = await _catalog.GetArtistsAsync(ct);
            return Ok(artists);
        }

        [HttpGet("releases")]
        public async Task<IActionResult> SearchReleases(
            [FromQuery] string? keyword,
            [FromQuery] int? artistId,
            [FromQuery] int? genreId,
            [FromQuery] int? yearFrom,
            [FromQuery] int? yearTo,
            [FromQuery] decimal? priceMin,
            [FromQuery] decimal? priceMax,
            [FromQuery] RecordCondition condition,
            CancellationToken ct = default)
        {
            var query = new SearchQueryDto(
        keyword,
        artistId,
        genreId,
        yearFrom,
        yearTo,
        priceMin,
        priceMax,
        MinCondition: null);

            var releases = await _catalog.SearchReleasesAsync(query, ct);
            return Ok(releases);
        }

        [HttpGet("releases/{id:int}")]
        public async Task<IActionResult> GetReleaseAsync(int id, CancellationToken ct = default)
        {
            var release = await _catalog.GetReleaseAsync(id, ct);
            return Ok(release);
        }

        [HttpGet("releases/{id:int}/listings")]
        public async Task<IActionResult> GetListingsForRelease(int id,
            [FromQuery] SortOption sort = SortOption.PriceAsc,
            CancellationToken ct = default)
        {
            var listings = await _catalog.GetListingsForReleaseAsync(id, sort, ct);
            return Ok(listings);
        }
    }
}