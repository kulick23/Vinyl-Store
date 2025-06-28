using DAL.Interfaces;
using Microsoft.Extensions.Options;
using Stripe;
using StripeCustomer = Stripe.Customer;
using DbCustomer = Domain.Entities.Customer;
using BLL.Options;
public sealed class StripePaymentService : IPaymentService
{
    private readonly ICartRepository _cartRepo;
    private readonly IUnitOfWork _uow;
    private readonly StripeSettings _opt;

    public StripePaymentService(
        ICartRepository cartRepo,
        IUnitOfWork uow,
        IOptions<StripeSettings> opt)
    {
        _cartRepo = cartRepo;
        _uow = uow;
        _opt = opt.Value;
    }

    public async Task<string> CreatePaymentIntentAsync(
        int customerId, CancellationToken ct = default)
    {
        var cart = await _cartRepo.GetByCustomerAsync(customerId, ct)
                   ?? throw new InvalidOperationException("Cart is empty.");

        decimal total = cart.Items.Sum(i => i.Quantity * i.InventoryItem.Price);

        if (total <= 0) throw new InvalidOperationException("Total = 0");

        var service = new PaymentIntentService();
        var intent = await service.CreateAsync(new PaymentIntentCreateOptions
        {
            Amount = (long)(total * 100),     // cents
            Currency = "usd",
            Metadata = new()
            {
                ["customerId"] = customerId.ToString(),
                ["cartId"] = cart.Id.ToString()
            },
            AutomaticPaymentMethods = new PaymentIntentAutomaticPaymentMethodsOptions
            {
                Enabled = true
            }
        });

        cart.StripePaymentIntentId = intent.Id;
        await _uow.SaveChangesAsync(ct);

        return intent.ClientSecret;
    }
}