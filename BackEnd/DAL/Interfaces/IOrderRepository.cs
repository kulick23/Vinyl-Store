using Domain.Entities;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace DAL.Interfaces
{
    public interface IOrderRepository : IRepository<Order>
    {
        public Task<IEnumerable<Order>> GetOrdersById(int? id);

        public Task<Order?> GetOrderWithItems(int id);
        public Task<IEnumerable<Order>> GetOrdersByCustomerId(int customerId);
    }
}
