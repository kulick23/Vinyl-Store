using System.Threading;
using System.Threading.Tasks;
using DAL.Data;
using DAL.Interfaces;
using Domain.Entities;
using Microsoft.EntityFrameworkCore;

namespace DAL.Repositories
{
    public class CustomerRepository : Repository<Customer>, ICustomerRepository
    {
        public CustomerRepository(AppDbContext context) : base(context) { }

        public async Task AddToWishlistAsync(int userId, RecordRelease release, CancellationToken ct)
        {
            var customer = await _dbSet
        .Include(c => c.Releases)
        .FirstOrDefaultAsync(c => c.Id == userId, ct)
        ?? throw new KeyNotFoundException($"No Customer found with Id {userId}.");

            if (customer.Releases.Any(r => r.Id == release.Id))
                return;

            _context.Set<RecordRelease>().Attach(release);
            customer.Releases.Add(release);

            await _context.SaveChangesAsync(ct);
        }

        public async Task<Customer?> GetByEmailAsync(string email, CancellationToken ct = default) =>
            await _dbSet.FirstOrDefaultAsync(c => c.Email == email, ct);

        public async Task RemoveFromWishlistAsync(int userId, int releaseId, CancellationToken ct = default)
        {
            var customer = await _dbSet
               .Include(c => c.Releases)
              .FirstOrDefaultAsync(c => c.Id == userId, ct)
               ?? throw new KeyNotFoundException($"No Customer with Id {userId}");

            var rel = customer.Releases.FirstOrDefault(r => r.Id == releaseId);
            if (rel is null) return;
            customer.Releases.Remove(rel);
            await _context.SaveChangesAsync(ct);
        }
    }
}
