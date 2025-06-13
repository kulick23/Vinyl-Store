using System.Threading;
using System.Threading.Tasks;
using Domain.Entities;

namespace DAL.Interfaces
{
    public interface ICustomerRepository : IRepository<Customer>
    {
        Task<Customer?> GetByEmailAsync(string email, CancellationToken ct);
        Task AddToWishlistAsync(int userId, RecordRelease release, CancellationToken ct);
    }
}