using Domain.Entities;

namespace Application.DTOs
{
    public record OrderItemDto(
        int InventoryItemId,
        string ReleaseTitle,
        RecordCondition Condition,
        int Quantity,
        decimal UnitPrice,
        decimal LineTotal);
}
