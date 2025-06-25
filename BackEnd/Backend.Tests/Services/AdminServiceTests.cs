using System.Threading;
using System.Threading.Tasks;
using Xunit;
using Moq;
using FluentAssertions;
using BLL.Services;
using BLL.DTO;
using DAL.Interfaces;
using Domain.Entities;
using AutoMapper;
using BLL.Interfaces;

namespace BLL.Tests;

public class AdminServiceTests
{
    private readonly Mock<IRecordReleaseRepository> _releaseRepo = new();

    private readonly Mock<IGenreRepository> _genreRepo = new();

    private readonly Mock<IArtistRepository> _artistRepo = new();

    private readonly Mock<ICustomerRepository> _customerRepo = new();

    private readonly Mock<ISellerProfileRepository> _sellerRepo = new();

    private readonly Mock<IUnitOfWork> _uow = new();

    private readonly Mock<IMapper> _mapper = new();

    private readonly Mock<IPathProvider> _paths = new();


    private AdminService CreateSut()
    {
        _paths.SetupGet(p => p.ImagesRoot).Returns("/tmp");
        return new AdminService(
            _releaseRepo.Object,
            _genreRepo.Object,
            _artistRepo.Object,
            _customerRepo.Object,
            _sellerRepo.Object,
            _uow.Object,
            _mapper.Object,
            _paths.Object);
    }

    [Fact]
    public async Task CreateGenreAsync_AddsAndReturnsGenre()
    {
        var dto = new GenreDto(1, "Rock");
        var entity = new Genre();
        _mapper.Setup(m => m.Map<Genre>(dto)).Returns(entity);
        _mapper.Setup(m => m.Map<GenreDto>(entity)).Returns(dto);

        var sut = CreateSut();
        var result = await sut.CreateGenreAsync(dto, CancellationToken.None);

        _genreRepo.Verify
            (r => r.AddAsync(entity, It.IsAny<CancellationToken>()), Times.Once);
        _uow.Verify(u => u.SaveChangesAsync(It.IsAny<CancellationToken>()), Times.Once);
        result.Should().Be(dto);
    }
}
