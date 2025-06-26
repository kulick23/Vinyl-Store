using DAL.Data;
using DAL.Repositories;
using Domain.Entities;
using Microsoft.EntityFrameworkCore;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Xunit;

namespace DAL.Tests.Repositories
{
    public class OrderRepositoryTests
    {
        private readonly AppDbContext _context;

        public OrderRepositoryTests()
        {
            var options = new DbContextOptionsBuilder<AppDbContext>()
                .UseInMemoryDatabase("OrderRepositoryTests")
                .Options;

            _context = new AppDbContext(options);
        }

        [Fact]
        public async Task GetByCustomerIdAsync_ReturnsCustomerOrders()
        {
            var customer = new Customer { Id = 1, FirstName = "Vasya", LastName = "Petrov" };
            var order1 = new Order { Id = 1, CustomerId = 1 };
            var order2 = new Order { Id = 2, CustomerId = 1 };

            _context.Set<Customer>().Add(customer);
            _context.Set<Order>().AddRange(order1, order2);
            await _context.SaveChangesAsync();

            var repository = new OrderRepository(_context);

            var result = await repository.GetByCustomerIdAsync(1);

            Assert.Equal(2, result.Count);
            Assert.Contains(result, o => o.Id == 1);
            Assert.Contains(result, o => o.Id == 2);
        }
    }
}