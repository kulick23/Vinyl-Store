using BLL.Options;
using DAL.Interfaces;
using Domain.Entities;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Options;

[ApiController]
[Route("api/webhooks/stripe")]
public class StripeWebhookController : ControllerBase
{
    private readonly IUnitOfWork _uow;
    private readonly ICartRepository _carts;
    private readonly IOrderRepository _orders;
    private readonly StripeSettings _cfg;

    public StripeWebhookController(
        IUnitOfWork uow,
        ICartRepository carts,
        IOrderRepository orders,
        IOptions<StripeSettings> cfg)
    {
        _uow = uow;
        _carts = carts;
        _orders = orders;
        _cfg = cfg.Value;
    }

    [HttpPost]
    public async Task<IActionResult> Handle()
    {
        var json = await new StreamReader(Request.Body).ReadToEndAsync();
        var sigHdr = Request.Headers["Stripe-Signature"];

        var evt = Stripe.EventUtility.ConstructEvent(
            json, sigHdr, _cfg.WebhookSecret);

        if (evt.Type == "payment_intent.succeeded")
        {
            var intent = evt.Data.Object as Stripe.PaymentIntent;
            await CreateOrderFromIntentAsync(intent!);
            return Ok();
        }

        return BadRequest();
    }

    private async Task CreateOrderFromIntentAsync(Stripe.PaymentIntent intent)
    {
        var cart = await _carts.Query()
                    .Include(c => c.Items)
                        .ThenInclude(i => i.InventoryItem)
                    .FirstOrDefaultAsync(c => c.StripePaymentIntentId == intent.Id);

        if (cart is null) return;

        var order = new Order
        {
            CustomerId = cart.CustomerId!.Value,
            OrderDate = DateTime.UtcNow,
            PaymentIntentId = intent.Id,
            TotalAmount = cart.Items.Sum(i => i.Quantity * i.InventoryItem.Price),
            OrderItems = cart.Items.Select(i => new OrderItem
            {
                InventoryItemId = i.InventoryItemId,
                Quantity = i.Quantity,
                UnitPrice = i.InventoryItem.Price
            }).ToList()
        };

        await _orders.AddAsync(order);
        _carts.Remove(cart);
        await _uow.SaveChangesAsync();
    }
}
