using DAL.Data;
using DAL.Repositories;
using Domain.Entities;
using Microsoft.EntityFrameworkCore;
using System.Threading.Tasks;
using Xunit;

namespace DAL.Tests.Repositories
{
    public class AccountRepositoryTests
    {
        private readonly AppDbContext _context;

        public AccountRepositoryTests()
        {
            var options = new DbContextOptionsBuilder<AppDbContext>()
                .UseInMemoryDatabase(databaseName: "AccountRepositoryTests")
                .Options;

            _context = new AppDbContext(options);
        }

        [Fact]
        public async Task GetByEmailAsync_ReturnsCustomer_WhenExists()
        {
            var customer = new Customer { Id = 1, Email = "sasha@mail.com" };
            _context.Set<Customer>().Add(customer);
            await _context.SaveChangesAsync();

            var repository = new AccountRepository(_context);
            var result = await repository.GetByEmailAsync("sasha@mail.com");

            Assert.NotNull(result);
            Assert.Equal("sasha@mail.com", result.Email);
        }

        [Fact]
        public async Task AddAsync_AddsCustomerToDatabase()
        {
            var customer = new Customer { Email = "misha@gmail.com" };
            var repository = new AccountRepository(_context);

            await repository.AddAsync(customer);
            await _context.SaveChangesAsync();

            var result = await _context.Set<Customer>().FirstOrDefaultAsync(c => c.Email == "misha@gmail.com");

            Assert.NotNull(result);
            Assert.Equal("misha@gmail.com", result.Email);
        }
    }
}