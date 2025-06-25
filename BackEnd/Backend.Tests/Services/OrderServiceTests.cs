using System;
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

public class OrderServiceTests
{
    private readonly Mock<IOrderRepository> _orderRepo = new();

    private readonly Mock<IInventoryItemRepository> _invRepo = new();

    private readonly Mock<ICartRepository> _cartRepo = new();

    private readonly Mock<IUnitOfWork> _uow = new();

    private readonly Mock<IMapper> _mapper = new();

    private OrderService CreateSut() => new(
        _orderRepo.Object,
        _invRepo.Object,
        _cartRepo.Object,
        _uow.Object,
        _mapper.Object);

    [Fact]
    public async Task GetOrderByIdAsync_ReturnsMappedDto()
    {
        var order = new Order();
        var dto = new OrderDto(1, DateTime.UtcNow, 1, 1, 0m, new List<OrderItemDto>());

        _orderRepo
            .Setup(r => r.GetOrderWithItemsAsync(1, It.IsAny<CancellationToken>()))
                  .ReturnsAsync(order);

        _mapper
            .Setup(m => m.Map<OrderDto>(order)).Returns(dto);

        var sut = CreateSut();
        var res = await sut.GetOrderByIdAsync(1, CancellationToken.None);

        res.Should().Be(dto);
    }
}
