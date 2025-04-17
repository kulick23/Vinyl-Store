using DAL.Data;
using DAL.Interfaces;
using Microsoft.EntityFrameworkCore;


namespace DAL.Repositories
{
    public class Repository<T> : IRepository<T> where T : class
    {
        protected readonly DbSet<T> _dbSet;
        protected readonly AppDbContext _appDbContext;

        public Repository(AppDbContext context)
        {
            _appDbContext = context;
            _dbSet = _appDbContext.Set<T>();
        }

        public async Task CreateAsync(T entity)
        {
            await _dbSet.AddAsync(entity);

           await _appDbContext.SaveChangesAsync();
        }

        public async Task DeleteAsync(T entity)
        {
             _dbSet.Remove(entity);
            await _appDbContext.SaveChangesAsync();
        }

        public async Task<IEnumerable<T>> GetAllWithPaginationAsync(int pageNumber, int rowCount)
        {
            return await _dbSet.Skip((pageNumber - 1) * rowCount).Take(rowCount).ToListAsync();
        }

        public async Task<T?> GetByIdAsync(int id)
        {
            return await _dbSet.FindAsync(id);
        }

        public async Task UpdateAsync(T entity)
        {
            _dbSet.Update(entity);
            await _appDbContext.SaveChangesAsync();
        }
    }
}
