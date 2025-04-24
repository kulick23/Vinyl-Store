using DAL.Data;
using DAL.Interfaces;
using Domain.Entities;

namespace DAL.Repositories
{
    public class RecordReleaseRepository : Repository<RecordRelease>, IRecordReleaseRepository
    {
        public RecordReleaseRepository(AppDbContext context) : base(context) { }
    }
}
