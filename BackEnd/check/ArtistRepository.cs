using System.Threading;
using System.Threading.Tasks;
using DAL.Data;
using DAL.Interfaces;
using Domain.Entities;
using Microsoft.EntityFrameworkCore;

namespace DAL.Repositories
{
    public class ArtistRepository : Repository<Artist>, IArtistRepository
    {
        public ArtistRepository(AppDbContext context) : base(context) { }

        public Task<Artist?> GetByNameAsync(string name, CancellationToken ct = default) =>
            _dbSet.FirstOrDefaultAsync(a => a.Name == name, ct);
    }
}
