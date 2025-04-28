using System.Collections.Generic;

namespace Application.DTOs
{
    public record CheckoutDto(
        IReadOnlyList<CheckoutItemDto> Items,
        string ShippingAddress,
        string PaymentMethod);
}
