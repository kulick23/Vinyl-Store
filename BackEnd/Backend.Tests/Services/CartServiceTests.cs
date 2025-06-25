using System.Collections.Generic;
using System.Threading;
using System.Threading.Tasks;
using Xunit;
using Moq;
using FluentAssertions;
using BLL.Services;
using DAL.Interfaces;
using Domain.Entities;
using AutoMapper;
using BLL.DTO;

namespace BLL.Tests;

public class CartServiceTests
{
    private readonly Mock<ICartRepository> _cartRepo = new();

    private readonly Mock<ICartItemRepository> _cartItemRepo = new();

    private readonly Mock<IInventoryItemRepository> _inventoryRepo = new();

    private readonly Mock<IUnitOfWork> _uow = new();

    private readonly Mock<IMapper> _mapper = new();


    private CartService CreateSut() => new(
        _cartRepo.Object,
        _cartItemRepo.Object,
        _inventoryRepo.Object,
        _uow.Object,
        _mapper.Object);

    [Fact]
    public async Task GetCartAsync_CreatesCart_WhenNoneExists()
    {
        _cartRepo.Setup(r => r.GetByCustomerAsync(1, It.IsAny<CancellationToken>()))
                 .ReturnsAsync((Cart)null!);

        var emptyCart = new Cart();
        _cartRepo.Setup(r => r.CreateAsync(1, null, It.IsAny<CancellationToken>()))
                 .ReturnsAsync(emptyCart);

        _mapper.Setup(m => m.Map<IReadOnlyList<CartItemDto>>(It.IsAny<object>()))
               .Returns(new List<CartItemDto>());

        var sut = CreateSut();

        var dto = await sut.GetCartAsync(1, CancellationToken.None);

        _cartRepo.Verify(r => r.CreateAsync(1, null, It.IsAny<CancellationToken>()), Times.Once);

        dto.GrandTotal.Should().Be(0);
    }

    [Fact]
    public async Task ClearAsync_RemovesAllItems_AndSaves()
    {
        var cart = new Cart();
        _cartRepo.Setup(r => r.GetByCustomerAsync(1, It.IsAny<CancellationToken>()))
                 .ReturnsAsync(cart);

        var sut = CreateSut();

        await sut.ClearAsync(1, CancellationToken.None);

        _uow.Verify(u => u.SaveChangesAsync(It.IsAny<CancellationToken>()), Times.Once);
    }
}
