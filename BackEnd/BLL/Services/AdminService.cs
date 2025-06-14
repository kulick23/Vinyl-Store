using Application.DTOs;
using AutoMapper;
using BLL.DTO;
using BLL.DTOs;
using BLL.Interfaces;
using DAL.Interfaces;
using DAL.Repositories;
using Domain.Entities;
using Microsoft.EntityFrameworkCore;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using System.Xml.Linq;

namespace BLL.Services
{
    public class AdminService : IAdminService
    {
        private readonly IRecordReleaseRepository _releaseRepo;
        private readonly IGenreRepository _genreRepo;
        private readonly IArtistRepository _artistRepo;
        private readonly ICustomerRepository _customerRepo;
        private readonly ISellerProfileRepository _sellerProfileRepo;
        private readonly IMapper _mapper;
        private readonly IUnitOfWork _unitOfWork;

        public AdminService(IRecordReleaseRepository releaseRepo,
                              IGenreRepository genreRepo,
                              IArtistRepository artistRepo,
                              IMapper mapper,
                              ICustomerRepository customerRepo,
                              IUnitOfWork unitOfWork,
                              ISellerProfileRepository sellerProfileRepo)
        {
            _releaseRepo = releaseRepo;
            _genreRepo = genreRepo;
            _artistRepo = artistRepo;
            _mapper = mapper;
            _customerRepo = customerRepo;
            _unitOfWork = unitOfWork;
            _sellerProfileRepo = sellerProfileRepo;
        }

        public async Task<ArtistDto> CreateArtistAsync(ArtistDto createDto, CancellationToken ct = default)
        {
            var entity = _mapper.Map<Artist>(createDto);
            await _artistRepo.AddAsync(entity, ct);
            await _unitOfWork.SaveChangesAsync();
            return _mapper.Map<ArtistDto>(entity);
        }

        public async Task<GenreDto> CreateGenreAsync(GenreDto createDto, CancellationToken ct = default)
        {
            var entity = _mapper.Map<Genre>(createDto);
            await _genreRepo.AddAsync(entity, ct);
            await _unitOfWork.SaveChangesAsync();
            return _mapper.Map<GenreDto>(entity);
        }

        public async Task<ReleaseDto> CreateReleaseAsync(ReleaseDto createDto, CancellationToken ct = default)
        {
            var entity = _mapper.Map<RecordRelease>(createDto);
            await _releaseRepo.AddAsync(entity, ct);
            await _unitOfWork.SaveChangesAsync();
            return _mapper.Map<ReleaseDto>(entity);
        }

        public async Task<SellerProfileDto> CreateSellerAsync(SellerProfileDto createDto, CancellationToken ct = default)
        {
            var entity = _mapper.Map<SellerProfile>(createDto);
            await _sellerProfileRepo.AddAsync(entity, ct);
            await _unitOfWork.SaveChangesAsync();
            return _mapper.Map<SellerProfileDto>(entity);
        }

        public async Task<CustomerDto> CreateUserAsync(CustomerDto createDto, CancellationToken ct = default)
        {
            var entity = _mapper.Map<Customer>(createDto);
            await _customerRepo.AddAsync(entity, ct);
            await _unitOfWork.SaveChangesAsync();
            return _mapper.Map<CustomerDto>(entity);
        }

        public async Task DeleteArtistAsync(int ArtistId, CancellationToken ct = default)
        {
            await _artistRepo.RemoveAsync(ArtistId);
        }

        public async Task DeleteGenreAsync(int GenreId, CancellationToken ct = default)
        {
            await _genreRepo.RemoveAsync(GenreId);
        }

        public async Task DeleteReleaseAsync(int releaseId, CancellationToken ct = default)
        {
            await _artistRepo.RemoveAsync(releaseId);
        }

        public async Task DeleteSellerAsync(int sellerId, CancellationToken ct = default)
        {
            await _sellerProfileRepo.RemoveAsync(sellerId);
        }

        public async Task DeleteUserAsync(int userId, CancellationToken ct = default)
        {
            await _customerRepo.RemoveAsync(userId);
        }

        public async Task<IReadOnlyList<ArtistDto>> GetAllArtistsAsync(CancellationToken ct = default)
        {
            var query = await _artistRepo.Query()
                .AsNoTracking()
                .ToListAsync();


            return _mapper.Map<IReadOnlyList<ArtistDto>>(query);
        }

        public async Task<IReadOnlyList<GenreDto>> GetAllGenresAsync(CancellationToken ct = default)
        {
            var query = await _genreRepo.Query()
                .AsNoTracking()
                .ToListAsync();


            return _mapper.Map<IReadOnlyList<GenreDto>>(query);
        }

        public async Task<IReadOnlyList<ReleaseDto>> GetAllReleasesAsync(CancellationToken ct = default)
        {
            var query = await _artistRepo.Query()
                .AsNoTracking()
                .ToListAsync();


            return _mapper.Map<IReadOnlyList<ReleaseDto>>(query);
        }

        public async Task<IReadOnlyList<SellerProfileDto>> GetAllSellersAsync(CancellationToken ct = default)
        {
            var query = await _sellerProfileRepo.Query()
                .AsNoTracking()
                .ToListAsync();


            return _mapper.Map<IReadOnlyList<SellerProfileDto>>(query);
        }

        public async Task<IReadOnlyList<CustomerDto>> GetAllUsersAsync(CancellationToken ct = default)
        {
            var query = await _artistRepo.Query()
                .AsNoTracking()
                .ToListAsync();


            return _mapper.Map<IReadOnlyList<CustomerDto>>(query);
        }

        public async Task UpdateArtistAsync(int ArtistId, ArtistDto updateDto, CancellationToken ct = default)
        {
            var item = await _artistRepo.GetByIdAsync(ArtistId);

            if (item == null)
            {
                throw new ArgumentNullException(nameof(item));
            }

            if (updateDto.Name is not null) item.Name = updateDto.Name;
            item.Id = updateDto.Id;

            await _unitOfWork.SaveChangesAsync();
        }

        public async Task UpdateGenreAsync(int GenreId, GenreDto updateDto, CancellationToken ct = default)
        {
            var item = await _genreRepo.GetByIdAsync(GenreId);

            if (item == null)
            {
                throw new ArgumentNullException(nameof(item));
            }

            if (updateDto.Name is not null) item.Name = updateDto.Name;
            item.Id = updateDto.Id;

            await _unitOfWork.SaveChangesAsync();
        }

        public async Task UpdateReleaseAsync(
    int releaseId,
    ReleaseUpdateDto dto,
    CancellationToken ct = default)
        {
            var release = await _releaseRepo.GetByIdAsync(releaseId, ct);
            if (release is null)
                throw new KeyNotFoundException($"Release {releaseId} not found");

            if (!string.IsNullOrWhiteSpace(dto.Title))
                release.Title = dto.Title!;

            if (dto.Year.HasValue)
                release.Year = dto.Year.Value;

            if (dto.ArtistId.HasValue && dto.ArtistId != 0)
                release.ArtistId = dto.ArtistId.Value;

            if (dto.GenreId.HasValue && dto.GenreId != 0)
                release.GenreId = dto.GenreId.Value;

            if (dto.Listings is not null)
                release.Listings = dto.Listings.ToList();

            await _unitOfWork.SaveChangesAsync(ct);
        }


        public async Task UpdateSellerAsync(int sellerId, SellerProfileUpdateDto updateDto, CancellationToken ct = default)
        {
            var item = await _sellerProfileRepo.GetByIdAsync(sellerId);

            if (item == null)
            {
                throw new ArgumentNullException(nameof(item));
            }

            if (updateDto.DisplayName is not null) item.DisplayName = updateDto.DisplayName;
            if (updateDto.Description is not null) item.Description = updateDto.Description;

            await _unitOfWork.SaveChangesAsync();
        }

        public async Task UpdateUserAsync(int userId, CustomerUpdateDto updateDto, CancellationToken ct = default)
        {
            var item = await _customerRepo.GetByIdAsync(userId);

            if (item == null)
            {
                throw new ArgumentNullException(nameof(item));
            }
            
            if (updateDto.FirstName is not null) item.FirstName = updateDto.FirstName;
            if (updateDto.LastName is not null) item.LastName = updateDto.LastName;
            if (updateDto.Email is not null) item.Email = updateDto.Email;
            if (updateDto.phone is not null) item.Phone = updateDto.phone;

            await _unitOfWork.SaveChangesAsync();
        }
    }
}
