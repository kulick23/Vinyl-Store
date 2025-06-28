public interface IPaymentService
{
    Task<string> CreatePaymentIntentAsync(
        int customerId,
        CancellationToken ct = default);
}