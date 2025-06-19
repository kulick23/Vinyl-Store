using DAL.Data;
using DAL.Interfaces;
using DAL.Repositories;
using Domain.Entities;
using Microsoft.EntityFrameworkCore;

public interface IReviewRepository : IRepository<Review>
{
    Task<bool> HasCustomerBoughtFromSellerAsync(int customerId, int sellerId, CancellationToken ct);
    IQueryable<Review> GetSellerReviews(int sellerId);
}
