using DAL.Data;
using DAL.Repositories;
using Domain.Entities;
using Microsoft.EntityFrameworkCore;
using System.Threading;
using System.Threading.Tasks;
using Xunit;

namespace DAL.Tests.Repositories
{
    public class ReviewRepositoryTests
    {
        private readonly AppDbContext _context;

        public ReviewRepositoryTests()
        {
            var options = new DbContextOptionsBuilder<AppDbContext>()
                .UseInMemoryDatabase(databaseName: "ReviewRepositoryTests")
                .Options;

            _context = new AppDbContext(options);
        }

        [Fact]
        public async Task HasCustomerBoughtFromSellerAsync_ReturnsTrue_WhenHasPurchase()
        {
            var repository = new ReviewRepository(_context);
            var ct = CancellationToken.None;

            var customer = new Customer
            {
                Email = "dima@mail.com",
                FirstName = "Dima",
                LastName = "Sidorov"
            };

            var seller = new SellerProfile
            {
                DisplayName = "Music Shop",
                Customer = customer
            };

            var artist = new Artist { Name = "Pink Floyd" };
            var genre = new Genre { Name = "Rock" };

            var release = new RecordRelease
            {
                Title = "Wish You Were Here",
                Artist = artist,
                Genre = genre
            };

            var inventory = new InventoryItem
            {
                Seller = seller,
                Release = release
            };

            var order = new Order { Customer = customer };
            order.OrderItems.Add(new OrderItem
            {
                InventoryItem = inventory,
                Quantity = 1,
                UnitPrice = 20.0m
            });

            _context.Set<Customer>().Add(customer);
            _context.Set<SellerProfile>().Add(seller);
            _context.Set<Artist>().Add(artist);
            _context.Set<Genre>().Add(genre);
            _context.Set<RecordRelease>().Add(release);
            _context.Set<InventoryItem>().Add(inventory);
            _context.Set<Order>().Add(order);

            await _context.SaveChangesAsync(ct);

            var result = await repository.HasCustomerBoughtFromSellerAsync(
                customer.Id,
                seller.Id,
                ct);

            Assert.True(result);
        }
    }
}