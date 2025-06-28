using BLL.Options;
using DAL.Interfaces;
using Microsoft.Extensions.Options;

public class CheckoutService : ICheckoutService
{
    private readonly ICartRepository _carts;
    private readonly IUnitOfWork _uow;
    private readonly Stripe.PaymentIntentService _intentSvc;
    private readonly StripeSettings _cfg;

    public CheckoutService(
        ICartRepository carts,
        IUnitOfWork uow,
        IOptions<StripeSettings> cfg)
    {
        _carts = carts;
        _uow = uow;
        _cfg = cfg.Value;
        _intentSvc = new Stripe.PaymentIntentService();
    }

    public async Task<CheckoutResponseDto> CreateOrUpdateIntentAsync(
        int userId, CancellationToken ct = default)
    {
        var cart = await _carts.GetByCustomerAsync(userId, ct)
                   ?? throw new InvalidOperationException("Cart empty");

        var amount = cart.Items.Sum(i => i.Quantity * i.InventoryItem.Price);
        var amountCents = (long)Math.Round(amount * 100m);

        Stripe.PaymentIntent intent;

        if (cart.StripePaymentIntentId is null)
        {
            var options = new Stripe.PaymentIntentCreateOptions
            {
                Amount = amountCents,
                Currency = "usd",
                Metadata = new() { ["cartId"] = cart.Id.ToString() },
            };
            intent = await _intentSvc.CreateAsync(options, null, ct);
            cart.StripePaymentIntentId = intent.Id;
        }
        else
        {
            var options = new Stripe.PaymentIntentUpdateOptions
            {
                Amount = amountCents
            };
            intent = await _intentSvc.UpdateAsync(
                         cart.StripePaymentIntentId, options, null, ct);
        }

        await _uow.SaveChangesAsync(ct);

        return new CheckoutResponseDto(
            intent.ClientSecret!,
            cart.StripePaymentIntentId);
    }
}
