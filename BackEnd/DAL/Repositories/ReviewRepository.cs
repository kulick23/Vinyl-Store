using DAL.Data;
using DAL.Interfaces;
using DAL.Repositories;
using Domain.Entities;
using Microsoft.EntityFrameworkCore;

namespace DAL.Repositories
{
    public sealed class ReviewRepository : Repository<Review>, IReviewRepository
    {
        private readonly DbSet<Order> _orders;
        public ReviewRepository(AppDbContext ctx) : base(ctx) =>
        _orders = ctx.Set<Order>();

        public IQueryable<Review> GetSellerReviews(int sellerId) =>
            _dbSet.Where(r => r.SellerId == sellerId);

        public Task<bool> HasCustomerBoughtFromSellerAsync(int customerId, int sellerId, CancellationToken ct) =>
            _orders.AnyAsync(o => o.CustomerId == customerId &&
                                  o.OrderItems.Any(i => i.InventoryItem.SellerId == sellerId), ct);
    }
}