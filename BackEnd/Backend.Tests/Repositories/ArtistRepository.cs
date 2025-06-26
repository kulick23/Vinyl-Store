using DAL.Data;
using DAL.Repositories;
using Domain.Entities;
using Microsoft.EntityFrameworkCore;
using Xunit;

namespace DAL.Tests.Repositories
{
    public class ArtistRepositoryTests
    {
        private readonly AppDbContext _context;

        public ArtistRepositoryTests()
        {
            var options = new DbContextOptionsBuilder<AppDbContext>()
                .UseInMemoryDatabase(databaseName: "ArtistRepositoryTests")
                .Options;

            _context = new AppDbContext(options);
        }

        [Fact]
        public async Task GetByNameAsync_ReturnsArtist_WhenExists()
        {
            var repository = new ArtistRepository(_context);
            var artist = new Artist { Name = "Pink Floyd" };
            _context.Set<Artist>().Add(artist);
            await _context.SaveChangesAsync();

            var result = await repository.GetByNameAsync("Pink Floyd");

            Assert.NotNull(result);
            Assert.Equal("Pink Floyd", result.Name);
        }

        [Fact]
        public async Task GetByNameAsync_ReturnsNull_WhenNotExists()
        {
            var repository = new ArtistRepository(_context);
            var result = await repository.GetByNameAsync("Metallica");

            Assert.Null(result);
        }
    }
}