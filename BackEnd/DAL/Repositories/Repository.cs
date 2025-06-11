using System.Collections.Generic;
using System.Linq;
using System.Threading;
using System.Threading.Tasks;
using DAL.Interfaces;
using DAL.Data;
using Domain.Entities;
using Microsoft.EntityFrameworkCore;

namespace DAL.Repositories
{
    /// <summary>
    /// Generic EF Core repository with async methods and cancellation support.
    /// SaveChanges are delegated to UnitOfWork.
    /// </summary>
    public class Repository<T> : IRepository<T> where T : BaseEntity
    {
        protected readonly AppDbContext _context;
        protected readonly DbSet<T> _dbSet;

        public Repository(AppDbContext context)
        {
            _context = context;
            _dbSet = context.Set<T>();
        }

        public ValueTask<T?> GetByIdAsync(int id, CancellationToken ct = default) =>
            _dbSet.FindAsync(new object[] { id }, ct);

        public async Task<IReadOnlyList<T>> ListAsync(
            int pageNumber,
            int pageSize,
            CancellationToken ct = default)
        {
            return await _dbSet
                .AsNoTracking()
                .Skip((pageNumber - 1) * pageSize)
                .Take(pageSize)
                .ToListAsync(ct);
        }

        public Task AddAsync(T entity, CancellationToken ct = default) =>
            _dbSet.AddAsync(entity, ct).AsTask();

        public void Update(T entity) => _dbSet.Update(entity);

        public void Remove(T entity) => _dbSet.Remove(entity);

        public async Task RemoveAsync(int Id)
        {
            var entity = await GetByIdAsync(Id);
            if (entity == null)
            {
                throw new ArgumentNullException(nameof(entity));
            }

            _dbSet.Remove(entity);
        }

        public Task<int> SaveChangesAsync(CancellationToken ct = default) =>
            _context.SaveChangesAsync(ct);

        public IQueryable<T> Query() => _dbSet.AsQueryable().AsNoTracking();
    }
}
