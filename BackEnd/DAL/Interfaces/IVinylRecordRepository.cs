using Domain.Entities;

namespace DAL.Interfaces
{
    public interface IVinylRecordRepository : IRepository<VinylRecord>
    {
        Task<IEnumerable<VinylRecord>> GetAllWithPaginationForIndexAsync(int page, int pageSize);

        Task<IEnumerable<VinylRecord>> GetRandomVinylRecords(int pageSize);

        public Task<IEnumerable<VinylRecord>> GetUniqueRandomVinylRecords(int pageSize);
    }
}
