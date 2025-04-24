using System.Collections.Generic;
using System.Threading;
using System.Threading.Tasks;
using Domain.Entities;

namespace DAL.Interfaces
{
    public interface IOrderRepository : IRepository<Order>
    {
        Task<IReadOnlyList<Order>> GetByIdsAsync(IEnumerable<int> ids, CancellationToken ct = default);
        Task<Order?> GetOrderWithItemsAsync(int id, CancellationToken ct = default);
        Task<IReadOnlyList<Order>> GetByCustomerIdAsync(int customerId, CancellationToken ct = default);
    }
}