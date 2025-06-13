using DAL.Data;
using DAL.Interfaces;
using Domain.Entities;
using Microsoft.EntityFrameworkCore;

namespace DAL.Repositories
{
    public class RecordReleaseRepository : Repository<RecordRelease>, IRecordReleaseRepository
    {
        public RecordReleaseRepository(AppDbContext context) : base(context) { }

        public IQueryable<RecordRelease> GetWishlist(int userId, CancellationToken ct)
        {
            return _dbSet
              .Where(r => r.Customers.Any(c => c.Id == userId));
        }
    }
}
