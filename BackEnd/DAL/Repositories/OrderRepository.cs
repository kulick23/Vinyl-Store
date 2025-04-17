using DAL.Data;
using DAL.Interfaces;
using Domain.Entities;
using Microsoft.EntityFrameworkCore;


namespace DAL.Repositories
{
    public class OrderRepository(AppDbContext context) : Repository<Order>(context), IOrderRepository
    {
        public async Task<IEnumerable<Order>> GetOrdersById(int? id)
        {
            return await _dbSet.Where(c => c.Id == id)
                .Include(c => c.OrderItems)
                .ToListAsync();
        }

        public async Task<Order?> GetOrderWithItems(int id)
        {
            return await _dbSet
                .Include(o => o.OrderItems)
                .ThenInclude(oi => oi.VinylRecord)
                .FirstOrDefaultAsync(o => o.Id == id);
        }

        public async Task<IEnumerable<Order>> GetOrdersByCustomerId(int customerId)
        {
            return await _dbSet
                .Where(o => o.CustomerId == customerId)
                .Include(o => o.OrderItems)
                .ThenInclude(oi => oi.VinylRecord)
                .ToListAsync();
        }
    }
}