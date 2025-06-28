using BLL.DTO;
using BLL.Services;
using BLL.Interfaces;
using Microsoft.AspNetCore.Mvc;
using System.Security.Claims;

namespace VinylMarket.Controllers
{
    [ApiController]
    [Route("api/orders")]
    public class OrderController : ControllerBase
    {
        private readonly IOrderService _orderService;

        public OrderController(IOrderService orderService)
        {
            _orderService = orderService;
        }

        [HttpPost]
        public async Task<IActionResult> PlaceOrder([FromBody] CheckoutDto checkout, CancellationToken ct = default)
        {
            var customerId = GetCustomerId();
            var order = await _orderService.PlaceOrderAsync(customerId, checkout, ct);
            return CreatedAtAction(nameof(GetOrderById), new { id = order.OrderId }, order);
        }

        [HttpGet]
        public async Task<IActionResult> GetOrders(CancellationToken ct = default)
        {
            var customerId = GetCustomerId();
            var orders = await _orderService.GetOrdersForCustomerAsync(customerId, ct);
            return Ok(orders);
        }

        [HttpPost("confirm")]
        public async Task<IActionResult> ConfirmOrder(
    [FromBody] ConfirmOrderDto dto,           // { "intentId": "pi_..." }
    CancellationToken ct = default)
        {
            int customerId = GetCustomerId();

            var order = await _orderService
                .CreateOrderFromPaymentIntentAsync(customerId, dto.IntentId, ct);

            return CreatedAtAction(nameof(GetOrderById),
                                    new { id = order.OrderId }, order);
        }

        [HttpGet("{id:int}")]
        public async Task<IActionResult> GetOrderById(int id, CancellationToken ct = default)
        {
            var customerId = GetCustomerId();

            var order = await _orderService.GetOrderForCustomerAsync(customerId, id, ct);
            return order is null ? NotFound() : Ok(order);
        }

        private int GetCustomerId()
        {
            var userId = User.FindFirstValue(ClaimTypes.NameIdentifier);
            if (string.IsNullOrEmpty(userId) || !int.TryParse(userId, out int customerId))
                throw new UnauthorizedAccessException("User is not authenticated");

            return customerId;
        }
    }
}
