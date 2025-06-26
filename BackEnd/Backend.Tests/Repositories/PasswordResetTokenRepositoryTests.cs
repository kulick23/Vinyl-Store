using DAL.Data;
using DAL.Repositories;
using Domain.Entities;
using Microsoft.EntityFrameworkCore;
using System;
using System.Threading.Tasks;
using Xunit;

namespace DAL.Tests.Repositories
{
    public class PasswordResetTokenRepositoryTests
    {
        private readonly AppDbContext _context;

        public PasswordResetTokenRepositoryTests()
        {
            var options = new DbContextOptionsBuilder<AppDbContext>()
                .UseInMemoryDatabase("PasswordResetTokenTests")
                .Options;

            _context = new AppDbContext(options);
        }

        [Fact]
        public async Task MarkUsedAsync_SetsTokenAsUsed()
        {
            var token = new PasswordResetToken
            {
                Token = Guid.NewGuid(),
                Customer = new Customer { Email = "vasya@mail.com" }
            };

            _context.Set<PasswordResetToken>().Add(token);
            await _context.SaveChangesAsync();

            var repository = new PasswordResetTokenRepository(_context);

            await repository.MarkUsedAsync(token.Token);
            await _context.SaveChangesAsync();

            var updatedToken = await _context.Set<PasswordResetToken>().FirstAsync();
            Assert.True(updatedToken.Used);
        }
    }
}