using BLL.DTO;
using BLL.Services;
using AutoMapper;
using AutoMapper.Configuration;
using DAL.Interfaces;
using Domain.Entities;
using Microsoft.EntityFrameworkCore;

namespace BLL.Services
{
    public class SellerProfileService : ISellerProfileService
    {
        private readonly ISellerProfileRepository _repo;
        private readonly IUnitOfWork _uow;
        private readonly IMapper _mapper;

        public SellerProfileService(ISellerProfileRepository repo, IUnitOfWork uow, IMapper mapper)
        {
            _repo = repo;
            _uow = uow;
            _mapper = mapper;
        }

        public async Task<SellerPageDto?> GetProfileAsync(int sellerId, CancellationToken ct = default)
        {
            var seller = await _repo.Query()
                         .Include(s => s.Reviews)
                             .ThenInclude(r => r.Customer)
                         .FirstOrDefaultAsync(s => s.Id == sellerId, ct);

            if (seller is null) return null;

            var reviews = seller.Reviews
                                .OrderByDescending(r => r.Created)
                                .ToList();

            decimal rating = reviews.Count == 0
                             ? 0
                             : Math.Round((decimal)reviews.Average(r => r.Rating), 2);

            return new SellerPageDto
            {
                SellerId = seller.Id,
                DisplayName = seller.DisplayName,
                Description = seller.Description,
                Rating = rating,
                Reviews = _mapper.Map<IReadOnlyList<ReviewDto>>(reviews)
            };
        }



        public async Task UpdateProfileAsync(int sellerId, SellerProfileUpdateDto dto, CancellationToken ct = default)
        {
            var entity = await _repo.GetByIdAsync(sellerId, ct)
                         ?? throw new KeyNotFoundException();

            entity.DisplayName = dto.DisplayName;
            entity.Description = dto.Description;

            await _uow.SaveChangesAsync(ct);
        }

        public async Task<SellerProfileDto> CreateProfileAsync(
            int customerId,
            SellerProfileCreateDto dto,
            CancellationToken ct = default)
        {
            if (await _repo.Query().AnyAsync(s => s.CustomerId == customerId, ct))
                throw new InvalidOperationException("Profile already exists");

            var entity = _mapper.Map<SellerProfile>(dto);
            entity.CustomerId = customerId;
            entity.Rating = 0;

            await _repo.AddAsync(entity, ct);
            await _uow.SaveChangesAsync(ct);

            return _mapper.Map<SellerProfileDto>(entity);
        }

        public async Task<SellerProfileDto?> GetProfileByCustomerIdAsync(
    int customerId,
    CancellationToken ct = default)
        {
            var entity = await _repo.Query()
                                    .Include(s => s.Reviews)
                                    .FirstOrDefaultAsync(s => s.CustomerId == customerId, ct);

            if (entity is null)
                return null;

            if (entity.Reviews.Count > 0)
                entity.Rating = Math.Round(
                    (decimal)entity.Reviews.Average(r => r.Rating), 2);

            return _mapper.Map<SellerProfileDto>(entity);
        }
    }
}