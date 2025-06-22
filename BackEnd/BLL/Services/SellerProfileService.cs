using Application.DTOs;
using Application.Services;
using AutoMapper;
using DAL.Interfaces;
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
    }
}
