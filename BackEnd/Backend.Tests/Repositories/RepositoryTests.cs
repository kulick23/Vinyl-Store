using DAL.Data;
using DAL.Repositories;
using Domain.Entities;
using Microsoft.EntityFrameworkCore;
using System.Threading.Tasks;
using Xunit;

namespace DAL.Tests.Repositories
{
    public class RepositoryTests
    {
        private readonly AppDbContext _context;

        public RepositoryTests()
        {
            var options = new DbContextOptionsBuilder<AppDbContext>()
                .UseInMemoryDatabase(databaseName: "RepositoryTests")
                .Options;

            _context = new AppDbContext(options);
        }

        [Fact]
        public async Task AddAsync_SavesEntity()
        {
            var repository = new ArtistRepository(_context);
            var artist = new Artist { Name = "Pink Floyd" };

            await repository.AddAsync(artist);
            await _context.SaveChangesAsync();

            var result = await _context.Set<Artist>().FindAsync(artist.Id);
            Assert.NotNull(result);
            Assert.Equal("Pink Floyd", result.Name);
        }

        [Fact]
        public async Task RemoveAsync_DeletesEntity()
        {
            var repository = new ArtistRepository(_context);
            var artist = new Artist { Name = "Pink Floyd" };

            _context.Set<Artist>().Add(artist);
            await _context.SaveChangesAsync();
            await repository.RemoveAsync(artist.Id);
            await _context.SaveChangesAsync();

            var result = await _context.Set<Artist>().FindAsync(artist.Id);
            Assert.Null(result);
        }
    }
}