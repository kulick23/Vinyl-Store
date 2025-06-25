using AutoMapper;
using BLL.DTO;
using BLL.Services;
using DAL.Data;
using DAL.Interfaces;
using DAL.Repositories;
using Domain.Entities;
using FluentAssertions;
using Microsoft.EntityFrameworkCore;
using Moq;
using System.Threading;
using System.Threading.Tasks;
using Xunit;

namespace BLL.Tests
{
    public class SellerProfileServiceTests
    {
        [Fact]
        public async Task GetProfileAsync_ReturnsNull_WhenNotFound()
        {
            var options 
                = new DbContextOptionsBuilder<AppDbContext>()
                .UseInMemoryDatabase("SellerProfile_ReturnsNull").Options;

            using var context = new AppDbContext(options);

            var repo = new SellerProfileRepository(context);

            var service = 
                new SellerProfileService(repo, Mock.Of<IUnitOfWork>(), Mock.Of<IMapper>());

            var result = await service.GetProfileAsync(99, CancellationToken.None);

            result.Should().BeNull();
        }
    }
}
