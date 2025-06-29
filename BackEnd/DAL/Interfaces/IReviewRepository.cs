using DAL.Interfaces;
using Domain.Entities;

namespace DAL.Interfaces
{
    public interface IReviewRepository : IRepository<Review>
    {
        Task<bool> HasCustomerBoughtFromSellerAsync(int customerId, int sellerId, CancellationToken ct);
        IQueryable<Review> GetSellerReviews(int sellerId);
    }
}
