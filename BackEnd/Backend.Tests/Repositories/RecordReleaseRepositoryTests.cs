using DAL.Data;
using DAL.Repositories;
using Domain.Entities;
using Microsoft.EntityFrameworkCore;
using System.Linq;
using System.Threading;
using System.Threading.Tasks;
using Xunit;

namespace DAL.Tests.Repositories
{
    public class RecordReleaseRepositoryTests
    {
        private readonly AppDbContext _context;

        public RecordReleaseRepositoryTests()
        {
            var options = new DbContextOptionsBuilder<AppDbContext>()
                .UseInMemoryDatabase("RecordReleaseTests")
                .Options;

            _context = new AppDbContext(options);
        }

        [Fact]
        public async Task GetWishlist_ReturnsUserWishlistItems()
        {
            var customer = new Customer { Id = 1, FirstName = "Jeka", LastName = "Nani" };
            var release1 = new RecordRelease { Title = "The Dark Side of the Moon", Artist = new Artist { Name = "Pink Floyd" } };
            var release2 = new RecordRelease { Title = "Led Zeppelin IV", Artist = new Artist { Name = "Led Zeppelin" } };

            release1.Customers.Add(customer);

            _context.Set<Customer>().Add(customer);
            _context.Set<RecordRelease>().AddRange(release1, release2);
            await _context.SaveChangesAsync();

            var repository = new RecordReleaseRepository(_context);

            var result = repository.GetWishlist(1, CancellationToken.None);

            Assert.Single(result);
            Assert.Equal("The Dark Side of the Moon", result.First().Title);
        }
    }
}