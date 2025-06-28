namespace BLL.DTO;

public class OrderItemDto
{
    public int InventoryItemId { get; init; }
    public string Title { get; init; } = string.Empty;
    public int Quantity { get; init; }
    public decimal UnitPrice { get; init; }
    public decimal Subtotal => UnitPrice * Quantity;
}
