using BLL.DTO;
using BLL.Services;
using AutoMapper;
using DAL.Interfaces;
using Domain.Entities;
using Microsoft.EntityFrameworkCore;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace BLL.Services
{
    public class OrderService : IOrderService
    {
        private readonly IOrderRepository _orderRepo;
        private readonly IInventoryItemRepository _inventoryRepo;
        private readonly ICartRepository _cartRepo;
        private readonly IUnitOfWork _uow;
        private readonly IMapper _mapper;

        public OrderService(IOrderRepository orderRepo,
                            IInventoryItemRepository inventoryRepo,
                            ICartRepository cartRepo,
                            IUnitOfWork uow,
                            IMapper mapper)
        {
            _orderRepo = orderRepo;
            _inventoryRepo = inventoryRepo;
            _cartRepo = cartRepo;
            _uow = uow;
            _mapper = mapper;
        }

        public async Task<OrderDto> PlaceOrderAsync(int customerId, CheckoutDto checkout, CancellationToken ct = default)
        {
            var order = new Order
            {
                CustomerId = customerId,
                OrderDate = DateTime.UtcNow
            };
            foreach (var item in checkout.Items)
            {
                var inv = await _inventoryRepo.GetByIdAsync(item.InventoryItemId, ct)
                          ?? throw new KeyNotFoundException("Listing not found");

                if (inv.Quantity < item.Quantity)
                    throw new InvalidOperationException("Insufficient stock");

                inv.Quantity -= item.Quantity;

                order.OrderItems.Add(new OrderItem
                {
                    InventoryItemId = inv.Id,
                    Quantity = item.Quantity,
                    UnitPrice = inv.Price
                });
            }

            await _orderRepo.AddAsync(order, ct);
            await _uow.SaveChangesAsync(ct);

            return _mapper.Map<OrderDto>(order);
        }

        public async Task<OrderDto?> GetOrderByIdAsync(int orderId, CancellationToken ct = default)
        {
            var order = await _orderRepo.GetOrderWithItemsAsync(orderId, ct);
            return order is null ? null : _mapper.Map<OrderDto>(order);
        }

        public async Task<IReadOnlyList<OrderDto>> GetOrdersForCustomerAsync(int customerId, CancellationToken ct = default)
        {
            var list = await _orderRepo.GetByCustomerIdAsync(customerId, ct);
            return _mapper.Map<IReadOnlyList<OrderDto>>(list);
        }

        public async Task<IReadOnlyList<OrderDto>> GetOrdersForSellerAsync(int sellerId, CancellationToken ct = default)
        {
            var list = await _orderRepo.Query()
                       .Where(o => o.OrderItems.Any(oi => oi.InventoryItem.SellerId == sellerId))
                       .ToListAsync(ct);
            return _mapper.Map<IReadOnlyList<OrderDto>>(list);
        }

        public async Task CancelOrderAsync(int orderId, int requesterId, CancellationToken ct = default)
        {
            var order = await _orderRepo.GetOrderWithItemsAsync(orderId, ct)
                       ?? throw new KeyNotFoundException();

            if (order.CustomerId != requesterId)
                throw new UnauthorizedAccessException();

            foreach (var item in order.OrderItems)
            {
                var inv = item.InventoryItem;
                inv.Quantity += item.Quantity;
            }

            _orderRepo.Remove(order);
            await _uow.SaveChangesAsync(ct);
        }
    }
}
