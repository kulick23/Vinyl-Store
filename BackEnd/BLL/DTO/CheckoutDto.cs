using System.Collections.Generic;

namespace BLL.DTO
{
    public record CheckoutDto(
        IReadOnlyList<CheckoutItemDto> Items,
        string ShippingAddress,
        string PaymentMethod);
}
