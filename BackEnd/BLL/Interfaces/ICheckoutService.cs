public interface ICheckoutService
{
    Task<CheckoutResponseDto> CreateOrUpdateIntentAsync(
        int userId,
        CancellationToken ct = default);
}
