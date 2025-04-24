using DAL.Data;
using DAL.Interfaces;
using Domain.Entities;

namespace DAL.Repositories
{
    public class OrderItemRepository : Repository<OrderItem>, IOrderItemRepository
    {
        public OrderItemRepository(AppDbContext context) : base(context) { }
    }
}
