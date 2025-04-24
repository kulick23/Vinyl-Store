using System;
using System.Threading;
using System.Threading.Tasks;

namespace DAL.Interfaces
{
    /// <summary>
    /// Unit‑of‑Work aggregates repositories and coordinates database commits.
    /// Dispose / DisposeAsync delegates to the underlying DbContext.
    /// </summary>
    public interface IUnitOfWork : IAsyncDisposable
    {
        IArtistRepository Artists { get; }
        IGenreRepository Genres { get; }
        ICustomerRepository Customers { get; }
        IOrderRepository Orders { get; }
        IOrderItemRepository OrderItems { get; }
        IRecordReleaseRepository RecordReleases { get; }
        IInventoryItemRepository InventoryItems { get; }
        ISellerProfileRepository SellerProfiles { get; }
        ICartItemRepository CartItems { get; }

        Task<int> SaveChangesAsync(CancellationToken ct = default);
    }
}
