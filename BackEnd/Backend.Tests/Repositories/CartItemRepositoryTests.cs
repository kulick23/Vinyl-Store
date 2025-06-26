using DAL.Data;
using DAL.Repositories;
using Domain.Entities;
using Microsoft.EntityFrameworkCore;
using System.Threading.Tasks;
using Xunit;

namespace DAL.Tests.Repositories
{
    public class CartItemRepositoryTests
    {
        private readonly AppDbContext _context;

        public CartItemRepositoryTests()
        {
            var options = new DbContextOptionsBuilder<AppDbContext>()
                .UseInMemoryDatabase("CartItemTests")
                .Options;

            _context = new AppDbContext(options);
        }

        [Fact]
        public async Task AddAsync_CreatesCartItem()
        {
            var item = new CartItem
            {
                Quantity = 2,

                InventoryItem = new InventoryItem
                {
                    Release = new RecordRelease { Title = "Animals" }
                }
            };

            var repository = new CartItemRepository(_context);

            await repository.AddAsync(item);
            await _context.SaveChangesAsync();

            var result = await _context.Set<CartItem>().FirstAsync();
            Assert.Equal(2, result.Quantity);
        }
    }
}