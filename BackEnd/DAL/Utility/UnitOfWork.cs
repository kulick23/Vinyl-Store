using System;
using System.Threading;
using System.Threading.Tasks;
using DAL.Interfaces;
using DAL.Data;
using Microsoft.EntityFrameworkCore.Storage;

namespace DAL
{
    public class UnitOfWork : IUnitOfWork
    {
        private readonly AppDbContext _dbContext;

        public IArtistRepository Artists { get; }
        public IGenreRepository Genres { get; }
        public ICustomerRepository Customers { get; }
        public IOrderRepository Orders { get; }
        public IOrderItemRepository OrderItems { get; }
        public IRecordReleaseRepository RecordReleases { get; }
        public IInventoryItemRepository InventoryItems { get; }
        public ISellerProfileRepository SellerProfiles { get; }
        public ICartItemRepository CartItems { get; }

        public UnitOfWork(
            AppDbContext dbContext,
            IArtistRepository artists,
            IGenreRepository genres,
            ICustomerRepository customers,
            IOrderRepository orders,
            IOrderItemRepository orderItems,
            IRecordReleaseRepository recordReleases,
            IInventoryItemRepository inventoryItems,
            ISellerProfileRepository sellerProfiles,
            ICartItemRepository cartItems)
        {
            _dbContext = dbContext ?? throw new ArgumentNullException(nameof(dbContext));
            Artists = artists;
            Genres = genres;
            Customers = customers;
            Orders = orders;
            OrderItems = orderItems;
            RecordReleases = recordReleases;
            InventoryItems = inventoryItems;
            SellerProfiles = sellerProfiles;
            CartItems = cartItems;
        }

        public Task<int> SaveChangesAsync(CancellationToken ct = default) =>
            _dbContext.SaveChangesAsync(ct);

        public ValueTask DisposeAsync() => _dbContext.DisposeAsync();
    }
}
