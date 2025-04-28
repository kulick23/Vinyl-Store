using System;
using System.Collections.Generic;

namespace Application.DTOs
{
    public record OrderDto(
        int OrderId,
        DateTime OrderDate,
        int CustomerId,
        int SellerId,
        decimal Total,
        IReadOnlyList<OrderItemDto> Items);
}
