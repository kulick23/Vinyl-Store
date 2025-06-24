using System.Collections.Generic;

namespace BLL.DTO
{
    public record CartDto(
        IReadOnlyList<CartItemDto> Items,
        decimal GrandTotal);
}
