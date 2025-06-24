using System;
using System.Collections.Generic;

namespace BLL.DTO
{
    public record OrderDto(
        int OrderId,
        DateTime OrderDate,
        int CustomerId,
        int SellerId,
        decimal Total,
        IReadOnlyList<OrderItemDto> Items);
}
