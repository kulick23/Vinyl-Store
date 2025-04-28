using System.Collections.Generic;

namespace Application.DTOs
{
    public record CartDto(
        IReadOnlyList<CartItemDto> Items,
        decimal GrandTotal);
}
