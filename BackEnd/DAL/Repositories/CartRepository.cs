using System;
using System.Linq;
using System.Threading;
using System.Threading.Tasks;
using DAL.Data;
using DAL.Interfaces;
using Domain.Entities;
using Microsoft.EntityFrameworkCore;

namespace DAL.Repositories
{
    public class CartRepository : Repository<Cart>, ICartRepository
    {
        public CartRepository(AppDbContext context) : base(context) { }

        public async Task<Cart?> GetByCustomerAsync(int customerId, CancellationToken ct = default)
        {
            return await _dbSet
                .Include(c => c.Items)
                    .ThenInclude(i => i.InventoryItem)
                        .ThenInclude(inv => inv.Release)
                .FirstOrDefaultAsync(c => c.CustomerId == customerId, ct);
        }

        public async Task<Cart?> GetBySessionAsync(string sessionKey, CancellationToken ct = default)
        {
            return await _dbSet
                .Include(c => c.Items)
                    .ThenInclude(i => i.InventoryItem)
                        .ThenInclude(inv => inv.Release)
                .FirstOrDefaultAsync(c => c.SessionKey == sessionKey, ct);
        }

        public async Task<Cart> CreateAsync(int? customerId, string? sessionKey, CancellationToken ct = default)
        {
            var cart = new Cart
            {
                CustomerId = customerId,
                SessionKey = sessionKey,
                CreatedAt = DateTime.UtcNow,
                UpdatedAt = DateTime.UtcNow
            };

            await _dbSet.AddAsync(cart, ct);
            return cart;
        }
    }
}
