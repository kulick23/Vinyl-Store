using Domain.Entities;

namespace DAL.Interfaces
{
    public interface IRecordReleaseRepository : IRepository<RecordRelease>
    {
        IQueryable<RecordRelease> GetWishlist(int userId, CancellationToken ct);
    }
}