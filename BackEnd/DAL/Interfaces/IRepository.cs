using System.Collections.Generic;
using System.Linq;
using System.Threading;
using System.Threading.Tasks;
using Domain.Entities;

namespace DAL.Interfaces
{
    public interface IRepository<T> where T : BaseEntity
    {
        /// <summary>Returns entity by Id or null if not found.</summary>
        ValueTask<T?> GetByIdAsync(int id, CancellationToken ct = default);

        /// <summary>Returns a read‑only paginated collection.</summary>
        Task<IReadOnlyList<T>> ListAsync(int pageNumber, int pageSize, CancellationToken ct = default);

        /// <summary>Adds entity to context.</summary>
        Task AddAsync(T entity, CancellationToken ct = default);

        /// <summary>Marks entity as modified in context.</summary>
        void Update(T entity);

        /// <summary>Removes entity from context.</summary>
        void Remove(T entity);

        /// <summary>Persists pending changes.</summary>
        Task<int> SaveChangesAsync(CancellationToken ct = default);

        /// <summary>Exposes IQueryable for custom LINQ or specification queries.</summary>
        IQueryable<T> Query();
    }
}