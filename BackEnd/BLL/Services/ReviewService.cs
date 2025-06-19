using AutoMapper;
using DAL.Interfaces;
using Domain.Entities;
using Microsoft.EntityFrameworkCore;

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
        bool allowed = await _repo.HasCustomerBoughtFromSellerAsync(customerId, dto.SellerId, ct);
        if (!allowed) throw new InvalidOperationException("You have no orders with this seller.");

        var entity = _mapper.Map<Review>(dto);
        entity.CustomerId = customerId;

        await _repo.AddAsync(entity, ct);

        var seller = await _sellerRepo.GetByIdAsync(dto.SellerId, ct);
        seller!.Rating = await _repo.GetSellerReviews(dto.SellerId)
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