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
using Stripe.Climate;
using Stripe;

namespace BLL.Services
{
    public class OrderService : IOrderService
    {
        private readonly IOrderRepository _orderRepo;
        private readonly IInventoryItemRepository _inventoryRepo;
        private readonly ICartRepository _cartRepo;
        private readonly IUnitOfWork _uow;
        private readonly IMapper _mapper;
        private readonly PaymentIntentService _intentSvc;

        public OrderService(
                IOrderRepository orderRepo,
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

            _intentSvc = new PaymentIntentService();
        }



        public async Task<OrderDto> PlaceOrderAsync(int customerId, CheckoutDto checkout, CancellationToken ct = default)
        {
            var order = new Domain.Entities.Order
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

        public async Task<OrderDto?> GetOrderForCustomerAsync(
    int customerId, int orderId, CancellationToken ct = default)
        {
            var order = await _orderRepo.GetOrderWithItemsAsync(orderId, ct);
            if (order is null || order.CustomerId != customerId)
                return null;

            return _mapper.Map<OrderDto>(order);
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

        public async Task<OrderDto> CreateOrderFromPaymentIntentAsync(
        int customerId, string intentId, CancellationToken ct = default)
        {

            var intent = await _intentSvc.GetAsync(intentId, null);
            if (intent.Status != "succeeded")
                throw new InvalidOperationException("Payment not completed");

            if (!intent.Metadata.TryGetValue("cartId", out var cartIdStr) ||
                !int.TryParse(cartIdStr, out var cartId))
                throw new InvalidOperationException("Cart id missing in metadata");

            var cart = await _cartRepo.GetByIdAsync(cartId, ct)
                       ?? throw new KeyNotFoundException("Cart not found");
            if (cart.CustomerId != customerId)
                throw new UnauthorizedAccessException();

            var order = new Domain.Entities.Order
            {
                CustomerId = customerId,
                OrderDate = DateTime.UtcNow
            };

            foreach (var item in cart.Items)
            {
                var inv = item.InventoryItem;

                if (inv.Quantity < item.Quantity)
                    throw new InvalidOperationException($"Not enough stock for listing {inv.Id}");

                order.OrderItems.Add(new OrderItem
                {
                    InventoryItemId = inv.Id,
                    Quantity = item.Quantity,
                    UnitPrice = inv.Price
                });

                inv.Quantity -= item.Quantity;
            }

            await _orderRepo.AddAsync(order, ct);

            _cartRepo.Remove(cart);

            await _uow.SaveChangesAsync(ct);

            return _mapper.Map<OrderDto>(order);
        }

    }
}
