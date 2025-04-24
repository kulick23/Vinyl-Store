using System.Threading;
using System.Threading.Tasks;
using Domain.Entities;

namespace DAL.Interfaces
{
    public interface IArtistRepository : IRepository<Artist>
    {
        Task<Artist?> GetByNameAsync(string name, CancellationToken ct = default);
    }
}