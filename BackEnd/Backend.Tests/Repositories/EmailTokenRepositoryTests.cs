using DAL.Data;
using DAL.Repositories;
using Domain.Entities;
using Microsoft.EntityFrameworkCore;
using System;
using System.Threading.Tasks;
using Xunit;

namespace DAL.Tests.Repositories
{
    public class EmailTokenRepositoryTests
    {
        private readonly AppDbContext _context;

        public EmailTokenRepositoryTests()
        {
            var options = new DbContextOptionsBuilder<AppDbContext>()
                .UseInMemoryDatabase("EmailTokenTests")
                .Options;

            _context = new AppDbContext(options);
        }

        [Fact]
        public async Task GetValidAsync_ReturnsUnexpiredToken()
        {
            var customer = new Customer { Id = 1, Email = "vasya@mail.com" };
            var token = new EmailToken
            {
                TokenHash = "valid_hash",
                Customer = customer,
                CustomerId = customer.Id,
                ExpiresAt = DateTime.UtcNow.AddDays(1)
            };

            _context.Set<Customer>().Add(customer);
            _context.Set<EmailToken>().Add(token);
            await _context.SaveChangesAsync();

            var repository = new EmailTokenRepository(_context);

            var result = await repository.GetValidAsync("valid_hash");

            Assert.NotNull(result);
            Assert.Equal("vasya@mail.com", result.Customer.Email);
        }
    }
}