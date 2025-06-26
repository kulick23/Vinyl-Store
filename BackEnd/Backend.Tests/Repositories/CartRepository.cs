using DAL.Data;
using DAL.Repositories;
using Domain.Entities;
using Microsoft.EntityFrameworkCore;
using System;
using System.Linq;
using System.Threading.Tasks;
using Xunit;

namespace DAL.Tests.Repositories
{
    public class CartRepositoryTests
    {
        private readonly AppDbContext _context;

        public CartRepositoryTests()
        {
            var options = new DbContextOptionsBuilder<AppDbContext>()
                .UseInMemoryDatabase(databaseName: "CartRepositoryTests")
                .Options;

            _context = new AppDbContext(options);
        }

        [Fact]
        public async Task CreateAsync_CreatesNewCart()
        {
            var repository = new CartRepository(_context);
            var cart = await repository.CreateAsync(1, null);

            Assert.NotNull(cart);
            Assert.Equal(1, cart.CustomerId);
            Assert.True(cart.Id > 0);
        }

        [Fact]
        public async Task GetByCustomerAsync_ReturnsCartWithItems()
        {
            var repository = new CartRepository(_context);
            var customer = new Customer
            {
                Email = "kolya@gmail.com",
                FirstName = "Kolya",
                LastName = "Petrov"
            };

            var cart = new Cart { Customer = customer };

            _context.Set<Customer>().Add(customer);
            _context.Set<Cart>().Add(cart);
            await _context.SaveChangesAsync();

            var result = await repository.GetByCustomerAsync(customer.Id);

            Assert.NotNull(result);
            Assert.Equal(customer.Id, result.CustomerId);
        }
    }
}