using System.Collections.Generic;
using System.Threading;
using System.Threading.Tasks;
using Application.DTOs;

namespace Application.Services
{
    public interface IOrderService
    {
        Task<OrderDto> PlaceOrderAsync(int customerId, CheckoutDto checkout, CancellationToken ct = default);
        Task<OrderDto?> GetOrderByIdAsync(int orderId, CancellationToken ct = default);
        Task<IReadOnlyList<OrderDto>> GetOrdersForCustomerAsync(int customerId, CancellationToken ct = default);
        Task<IReadOnlyList<OrderDto>> GetOrdersForSellerAsync(int sellerId, CancellationToken ct = default);
        Task CancelOrderAsync(int orderId, int requesterId, CancellationToken ct = default);
    }
}
