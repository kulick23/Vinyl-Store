using System.Threading;
using System.Threading.Tasks;
using Domain.Entities;

namespace DAL.Interfaces
{
    public interface ICartRepository : IRepository<Cart>
    {
        Task<Cart?> GetByCustomerAsync(int customerId, CancellationToken ct = default);
        Task<Cart?> GetBySessionAsync(string sessionKey, CancellationToken ct = default);
        Task<Cart> CreateAsync(int? customerId, string? sessionKey, CancellationToken ct = default);
    }
}
