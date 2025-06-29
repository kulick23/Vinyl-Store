using AutoMapper;
using BLL.DTO;
using BLL.Interfaces;
using DAL.Interfaces;
using Domain.Entities;
using Microsoft.EntityFrameworkCore;

namespace BLL.Services
{
    public sealed class ReviewService : IReviewService
    {
        private readonly IReviewRepository _repo;
        private readonly ISellerProfileRepository _sellerRepo;
        private readonly IUnitOfWork _uow;
        private readonly IMapper _mapper;

        public ReviewService(IReviewRepository repo,
                             ISellerProfileRepository sellerRepo,
                             IUnitOfWork uow,
                             IMapper mapper)
        {
            _repo = repo;
            _sellerRepo = sellerRepo;
            _uow = uow;
            _mapper = mapper;
        }

        public async Task<ReviewDto> AddReviewAsync(
        int customerId, ReviewCreateDto dto, CancellationToken ct)
        {
            var seller = await _sellerRepo.GetByIdAsync(dto.SellerId, ct)
                         ?? throw new KeyNotFoundException("Seller not found");

            if (seller.CustomerId == customerId)
                throw new InvalidOperationException("You cannot review yourself.");

            bool allowed = await _repo.HasCustomerBoughtFromSellerAsync(customerId,
                                                                        dto.SellerId, ct);
            if (!allowed)
                throw new InvalidOperationException(
                    "You have no orders with this seller.");

            var entity = _mapper.Map<Review>(dto);
            entity.CustomerId = customerId;
            await _repo.AddAsync(entity, ct);

            seller.Rating = await _repo.GetSellerReviews(dto.SellerId)
                                       .AverageAsync(r => (decimal)r.Rating, ct);

            await _uow.SaveChangesAsync(ct);
            return _mapper.Map<ReviewDto>(entity);
        }

        public async Task<IReadOnlyList<ReviewDto>> GetSellerReviewsAsync(int sellerId, CancellationToken ct) =>
            _mapper.Map<IReadOnlyList<ReviewDto>>(
                await _repo.GetSellerReviews(sellerId)
                           .Include(r => r.Customer)
                           .OrderByDescending(r => r.Created)
                           .ToListAsync(ct));
    }
}