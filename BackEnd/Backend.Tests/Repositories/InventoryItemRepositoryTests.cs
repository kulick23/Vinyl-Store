using DAL.Data;
using DAL.Repositories;
using Domain.Entities;
using Microsoft.EntityFrameworkCore;
using System.Threading.Tasks;
using Xunit;

namespace DAL.Tests.Repositories
{
    public class InventoryItemRepositoryTests
    {
        private readonly AppDbContext _context;

        public InventoryItemRepositoryTests()
        {
            var options = new DbContextOptionsBuilder<AppDbContext>()
                .UseInMemoryDatabase("InventoryItemTests")
                .Options;

            _context = new AppDbContext(options);
        }

        [Fact]
        public async Task GetByIdAsync_ReturnsInventoryItem()
        {
            var item = new InventoryItem
            {
                Price = 29.99m,
                Release = new RecordRelease { Title = "The Wall" }
            };

            _context.Set<InventoryItem>().Add(item);

            await _context.SaveChangesAsync();

            var repository = new InventoryItemRepository(_context);

            var result = await repository.GetByIdAsync(item.Id);

            Assert.Equal(29.99m, result.Price);
        }
    }
}