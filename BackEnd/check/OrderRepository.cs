using System.Collections.Generic;
using System.Linq;
using System.Threading;
using System.Threading.Tasks;
using DAL.Data;
using DAL.Interfaces;
using Domain.Entities;
using Microsoft.EntityFrameworkCore;

namespace DAL.Repositories
{
    public class OrderRepository : Repository<Order>, IOrderRepository
    {
        public OrderRepository(AppDbContext context) : base(context) { }

        public async Task<IReadOnlyList<Order>> GetByIdsAsync(IEnumerable<int> ids, CancellationToken ct = default) =>
            await _dbSet
                .Include(o => o.OrderItems)
                .Where(o => ids.Contains(o.Id))
                .ToListAsync(ct);

        public Task<Order?> GetOrderWithItemsAsync(int id, CancellationToken ct = default) =>
            _dbSet
                .Include(o => o.OrderItems)
                .FirstOrDefaultAsync(o => o.Id == id, ct);

        public async Task<IReadOnlyList<Order>> GetByCustomerIdAsync(int customerId, CancellationToken ct = default) =>
            await _dbSet
                .Where(o => o.CustomerId == customerId)
                .Include(o => o.OrderItems)
                .ToListAsync(ct);
    }
}
