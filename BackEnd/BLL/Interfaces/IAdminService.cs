using Application.DTOs;
using BLL.DTO;
using BLL.DTOs;
using Domain.Entities;
using Microsoft.AspNetCore.Http;

namespace BLL.Interfaces
{
    public interface IAdminService
    {
        Task<IReadOnlyList<GenreDto>> GetAllGenresAsync(CancellationToken ct = default);
        Task UpdateGenreAsync(int GenreId, GenreDto updateDto, CancellationToken ct = default);
        Task DeleteGenreAsync(int GenreId, CancellationToken ct = default);
        Task<GenreDto> CreateGenreAsync(GenreDto createDto, CancellationToken ct = default);

        Task<IReadOnlyList<ArtistDto>> GetAllArtistsAsync(CancellationToken ct = default);
        Task UpdateArtistAsync(int ArtistId, ArtistDto updateDto, CancellationToken ct = default);
        Task DeleteArtistAsync(int ArtistId, CancellationToken ct = default);
        Task<ArtistDto> CreateArtistAsync(ArtistDto createDto, CancellationToken ct = default);

        Task<IReadOnlyList<CustomerDto>> GetAllUsersAsync(CancellationToken ct = default);
        Task UpdateUserAsync(int userId, CustomerUpdateDto updateDto, CancellationToken ct = default);
        Task DeleteUserAsync(int userId, CancellationToken ct = default);
        Task<CustomerDto> CreateUserAsync(CustomerDto createDto, CancellationToken ct = default);

        Task<IReadOnlyList<SellerProfileDto>> GetAllSellersAsync(CancellationToken ct = default);
        Task UpdateSellerAsync(int sellerId, SellerProfileUpdateDto updateDto, CancellationToken ct = default);
        Task DeleteSellerAsync(int sellerId, CancellationToken ct = default);
        Task<SellerProfileDto> CreateSellerAsync(SellerProfileDto createDto, CancellationToken ct = default);

        Task<IReadOnlyList<ReleaseDto>> GetAllReleasesAsync(CancellationToken ct = default);
        Task UpdateReleaseAsync(int releaseId, ReleaseUpdateDto updateDto, CancellationToken ct = default);
        Task DeleteReleaseAsync(int releaseId, CancellationToken ct = default);
        Task<ReleaseDto> CreateReleaseAsync(ReleaseCreateDto dto, CancellationToken ct = default);
        Task UpdateReleaseImageAsync(int releaseId, IFormFile file, CancellationToken ct = default);


    }
}
