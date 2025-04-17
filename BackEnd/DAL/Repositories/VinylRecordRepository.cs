using DAL.Data;
using DAL.Interfaces;
using Domain.Entities;
using Microsoft.EntityFrameworkCore;


namespace DAL.Repositories
{
    public class VinylRecordRepository(AppDbContext context) : Repository<VinylRecord>(context), IVinylRecordRepository
    {
        public async Task<IEnumerable<VinylRecord>> GetAllWithPaginationForIndexAsync(int page, int pageSize)
        {
            return await _dbSet
                .Include(r => r.Artist)
                .Include(r => r.Genre)
                .OrderBy(r => r.Id)
                .Skip((page - 1) * pageSize)
                .Take(pageSize)
                .ToListAsync();
        }

        public async Task<IEnumerable<VinylRecord>> GetRandomVinylRecords(int pageSize)
        {
            return await _dbSet
                .OrderBy(r => Guid.NewGuid())
                .Take(pageSize)
                .Include(c => c.Artist)
                .ToListAsync();
        }

        public async Task<IEnumerable<VinylRecord>> GetUniqueRandomVinylRecords(int pageSize)
        {
            return await _dbSet
                .Include(r => r.Artist)
                .Include(r => r.Genre)
                .OrderBy(r => EF.Functions.Random())
                .Take(pageSize) 
                .ToListAsync();
        }
    }
}
