namespace Application.DTOs
{
    public record CartItemDto(
        int CartItemId,
        int InventoryItemId,
        string ReleaseTitle,
        decimal UnitPrice,
        int Quantity,
        decimal LineTotal);
}
