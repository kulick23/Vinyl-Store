using System;
using System.Collections.Generic;
using System.IO;
using System.Linq;
using System.Threading;
using System.Threading.Tasks;
using Application.DTOs;
using AutoMapper;
using BLL.DTO;
using BLL.DTOs;
using BLL.Interfaces;
using DAL.Interfaces;
using Domain.Entities;
using Microsoft.AspNetCore.Hosting;
using Microsoft.AspNetCore.Http;
using Microsoft.EntityFrameworkCore;
using Microsoft.AspNetCore.Hosting.Internal;

namespace BLL.Services
{
    public sealed class AdminService : IAdminService
    {
        private readonly IRecordReleaseRepository _releaseRepo;
        private readonly IGenreRepository _genreRepo;
        private readonly IArtistRepository _artistRepo;
        private readonly ICustomerRepository _customerRepo;
        private readonly ISellerProfileRepository _sellerRepo;
        private readonly IUnitOfWork _uow;
        private readonly IMapper _mapper;

        private readonly string _imgRoot;

        public AdminService(
            IRecordReleaseRepository releaseRepo,
            IGenreRepository genreRepo,
            IArtistRepository artistRepo,
            ICustomerRepository customerRepo,
            ISellerProfileRepository sellerRepo,
            IUnitOfWork uow,
            IMapper mapper,
            IPathProvider paths)
        {
            _releaseRepo = releaseRepo;
            _genreRepo = genreRepo;
            _artistRepo = artistRepo;
            _customerRepo = customerRepo;
            _sellerRepo = sellerRepo;
            _uow = uow;
            _mapper = mapper;

            _imgRoot = paths.ImagesRoot;
            Directory.CreateDirectory(_imgRoot);
        }

        /* ------------ private: сохранить файл ------------ */

        private async Task<string> SaveImageAsync(IFormFile file, CancellationToken ct)
        {
            var ext = Path.GetExtension(file.FileName);
            var name = $"{Guid.NewGuid():N}{ext}";
            var path = Path.Combine(_imgRoot, name);

            await using var fs = new FileStream(path, FileMode.Create);
            await file.CopyToAsync(fs, ct);

            return $"/images/{name}";
        }

        /* ========== CREATE ========== */

        public async Task<ArtistDto> CreateArtistAsync(ArtistDto dto, CancellationToken ct = default)
        {
            var entity = _mapper.Map<Artist>(dto);
            await _artistRepo.AddAsync(entity, ct);
            await _uow.SaveChangesAsync(ct);
            return _mapper.Map<ArtistDto>(entity);
        }

        public async Task<GenreDto> CreateGenreAsync(GenreDto dto, CancellationToken ct = default)
        {
            var entity = _mapper.Map<Genre>(dto);
            await _genreRepo.AddAsync(entity, ct);
            await _uow.SaveChangesAsync(ct);
            return _mapper.Map<GenreDto>(entity);
        }

        public async Task<ReleaseDto> CreateReleaseAsync(
    ReleaseCreateDto dto, CancellationToken ct = default)
        {
            var entity = _mapper.Map<RecordRelease>(dto);
            await _releaseRepo.AddAsync(entity, ct);
            await _uow.SaveChangesAsync(ct);
            return _mapper.Map<ReleaseDto>(entity);
        }


        public async Task UpdateReleaseImageAsync(
            int releaseId,
            IFormFile file,
            CancellationToken ct = default)
        {
            var rel = await _releaseRepo.GetByIdAsync(releaseId, ct)
                      ?? throw new KeyNotFoundException($"Release {releaseId} not found");

            rel.ImageUrl = await SaveImageAsync(file, ct);
            await _uow.SaveChangesAsync(ct);
        }

        public async Task<SellerProfileDto> CreateSellerAsync(
            SellerProfileDto dto, CancellationToken ct = default)
        {
            var entity = _mapper.Map<SellerProfile>(dto);
            await _sellerRepo.AddAsync(entity, ct);
            await _uow.SaveChangesAsync(ct);
            return _mapper.Map<SellerProfileDto>(entity);
        }

        public async Task<CustomerDto> CreateUserAsync(
            CustomerDto dto, CancellationToken ct = default)
        {
            var entity = _mapper.Map<Customer>(dto);
            await _customerRepo.AddAsync(entity, ct);
            await _uow.SaveChangesAsync(ct);
            return _mapper.Map<CustomerDto>(entity);
        }

        /* ========== READ (list) ========== */

        public async Task<IReadOnlyList<ArtistDto>> GetAllArtistsAsync(CancellationToken ct = default)
            => _mapper.Map<IReadOnlyList<ArtistDto>>(
                   await _artistRepo.Query().AsNoTracking().ToListAsync(ct));

        public async Task<IReadOnlyList<GenreDto>> GetAllGenresAsync(CancellationToken ct = default)
            => _mapper.Map<IReadOnlyList<GenreDto>>(
                   await _genreRepo.Query().AsNoTracking().ToListAsync(ct));

        public async Task<IReadOnlyList<ReleaseDto>> GetAllReleasesAsync(CancellationToken ct = default)
            => _mapper.Map<IReadOnlyList<ReleaseDto>>(
                   await _releaseRepo.Query().AsNoTracking().ToListAsync(ct));

        public async Task<IReadOnlyList<SellerProfileDto>> GetAllSellersAsync(CancellationToken ct = default)
            => _mapper.Map<IReadOnlyList<SellerProfileDto>>(
                   await _sellerRepo.Query().AsNoTracking().ToListAsync(ct));

        public async Task<IReadOnlyList<CustomerDto>> GetAllUsersAsync(CancellationToken ct = default)
            => _mapper.Map<IReadOnlyList<CustomerDto>>(
                   await _customerRepo.Query().AsNoTracking().ToListAsync(ct));

        /* ========== UPDATE ========== */

        public async Task UpdateArtistAsync(int id, ArtistDto dto, CancellationToken ct = default)
        {
            var entity = await _artistRepo.GetByIdAsync(id, ct) ??
                         throw new KeyNotFoundException($"Artist {id} not found");

            if (!string.IsNullOrWhiteSpace(dto.Name))
                entity.Name = dto.Name!;

            await _uow.SaveChangesAsync(ct);
        }

        public async Task UpdateGenreAsync(int id, GenreDto dto, CancellationToken ct = default)
        {
            var entity = await _genreRepo.GetByIdAsync(id, ct) ??
                         throw new KeyNotFoundException($"Genre {id} not found");

            if (!string.IsNullOrWhiteSpace(dto.Name))
                entity.Name = dto.Name!;

            await _uow.SaveChangesAsync(ct);
        }

        public async Task UpdateReleaseAsync(int id, ReleaseUpdateDto dto, CancellationToken ct = default)
        {
            var rel = await _releaseRepo.GetByIdAsync(id, ct)
                      ?? throw new KeyNotFoundException($"Release {id} not found");

            if (!string.IsNullOrWhiteSpace(dto.Title)) rel.Title = dto.Title!;
            if (dto.Year.HasValue) rel.Year = dto.Year.Value;
            if (dto.ArtistId.HasValue && dto.ArtistId != 0) rel.ArtistId = dto.ArtistId.Value;
            if (dto.GenreId.HasValue && dto.GenreId != 0) rel.GenreId = dto.GenreId.Value;

            await _uow.SaveChangesAsync(ct);
        }

        public async Task UpdateSellerAsync(
            int id, SellerProfileUpdateDto dto, CancellationToken ct = default)
        {
            var seller = await _sellerRepo.GetByIdAsync(id, ct) ??
                         throw new KeyNotFoundException($"Seller {id} not found");

            if (!string.IsNullOrWhiteSpace(dto.DisplayName))
                seller.DisplayName = dto.DisplayName!;
            if (dto.Description is not null)
                seller.Description = dto.Description;

            await _uow.SaveChangesAsync(ct);
        }

        public async Task UpdateUserAsync(
            int id, CustomerUpdateDto dto, CancellationToken ct = default)
        {
            var user = await _customerRepo.GetByIdAsync(id, ct) ??
                       throw new KeyNotFoundException($"User {id} not found");

            if (!string.IsNullOrWhiteSpace(dto.FirstName)) user.FirstName = dto.FirstName!;
            if (!string.IsNullOrWhiteSpace(dto.LastName)) user.LastName = dto.LastName!;
            if (!string.IsNullOrWhiteSpace(dto.Email)) user.Email = dto.Email!;
            if (!string.IsNullOrWhiteSpace(dto.phone)) user.Phone = dto.phone!;

            await _uow.SaveChangesAsync(ct);
        }

        /* ========== DELETE ========== */

        public Task DeleteArtistAsync(int id, CancellationToken ct = default)
            => _artistRepo.RemoveAsync(id);

        public Task DeleteGenreAsync(int id, CancellationToken ct = default)
            => _genreRepo.RemoveAsync(id);

        public Task DeleteReleaseAsync(int id, CancellationToken ct = default)
            => _releaseRepo.RemoveAsync(id);

        public Task DeleteSellerAsync(int id, CancellationToken ct = default)
            => _sellerRepo.RemoveAsync(id);

        public Task DeleteUserAsync(int id, CancellationToken ct = default)
            => _customerRepo.RemoveAsync(id);
    }
}
