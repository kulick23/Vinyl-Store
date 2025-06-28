using BLL.DTO;

namespace BLL.DTO;

public record OrderDto
{
    public int OrderId { get; init; }
    public DateTime OrderDate { get; init; }
    public decimal Total { get; init; }
    public int CustomerId { get; init; }
    public IReadOnlyList<OrderItemDto> Items { get; init; } = [];
}