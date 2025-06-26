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
    public class CustomerRepositoryTests
    {
        private readonly AppDbContext _context;
        private readonly CancellationToken _ct = CancellationToken.None;

        public CustomerRepositoryTests()
        {
            var options = new DbContextOptionsBuilder<AppDbContext>()
                .UseInMemoryDatabase(databaseName: "CustomerRepositoryTests")
                .Options;

            _context = new AppDbContext(options);
        }

        [Fact]
        public async Task AddToWishlistAsync_AddsRelease()
        {
            var repository = new CustomerRepository(_context);
            var customer = new Customer
            {
                Email = "vasya@gmail.com",
                FirstName = "Vasya",
                LastName = "Pupkin"
            };

            var artist = new Artist { Name = "Pink Floyd" };
            var genre = new Genre { Name = "Rock" };
            var release = new RecordRelease
            {
                Title = "The Wall",
                Artist = artist,
                Genre = genre
            };

            _context.Set<Customer>().Add(customer);
            _context.Set<Artist>().Add(artist);
            _context.Set<Genre>().Add(genre);
            _context.Set<RecordRelease>().Add(release);
            await _context.SaveChangesAsync(_ct);

            await repository.AddToWishlistAsync(customer.Id, release, _ct);

            var updatedCustomer = await _context.Set<Customer>()
                .Include(c => c.Releases)
                .FirstAsync(c => c.Id == customer.Id, _ct);

            Assert.Single(updatedCustomer.Releases);
            Assert.Equal("The Wall", updatedCustomer.Releases.First().Title);
        }

        [Fact]
        public async Task RemoveFromWishlistAsync_RemovesRelease()
        {
            var repository = new CustomerRepository(_context);
            var customer = new Customer
            {
                Email = "petya@mail.com",
                FirstName = "Petya",
                LastName = "Ivanov"
            };

            var artist = new Artist { Name = "Pink Floyd" };
            var genre = new Genre { Name = "Rock" };
            var release = new RecordRelease
            {
                Title = "Dark Side",
                Artist = artist,
                Genre = genre
            };

            customer.Releases.Add(release);

            _context.Set<Customer>().Add(customer);
            _context.Set<Artist>().Add(artist);
            _context.Set<Genre>().Add(genre);
            _context.Set<RecordRelease>().Add(release);
            await _context.SaveChangesAsync(_ct);

            await repository.RemoveFromWishlistAsync(customer.Id, release.Id, _ct);
            await _context.SaveChangesAsync(_ct);

            var updatedCustomer = await _context.Set<Customer>()
                .Include(c => c.Releases)
                .FirstAsync(c => c.Id == customer.Id, _ct);

            Assert.Empty(updatedCustomer.Releases);
        }
    }
}