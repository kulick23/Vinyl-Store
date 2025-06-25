using System.Threading;
using System.Threading.Tasks;
using Xunit;
using Moq;
using FluentAssertions;
using BLL.Services.Implementation;
using DAL.Interfaces;
using Domain.Entities;
using AutoMapper;
using BLL.DTO;

namespace BLL.Tests;

public class InventoryServiceTests
{
    private readonly Mock<IInventoryItemRepository> _repo = new();

    private readonly Mock<IUnitOfWork> _uow = new();

    private readonly Mock<IMapper> _mapper = new();

    private InventoryService CreateSut() =>
        new(_repo.Object, _uow.Object, _mapper.Object);

    [Fact]
    public async Task GetListingAsync_ReturnsMappedDto()
    {
        var entity = new InventoryItem();

        var dto
            = new InventoryItemDto(1, 1, 1, "seller", 10m, 1, default, 5m, "");

        _repo.Setup(r => r.GetByIdAsync(1, It.IsAny<CancellationToken>()))
             .ReturnsAsync(entity);

        _mapper.Setup(m => m.Map<InventoryItemDto>(entity)).Returns(dto);

        var sut = CreateSut();
        var res = await sut.GetListingAsync(1, CancellationToken.None);
        res.Should().Be(dto);
    }


}

