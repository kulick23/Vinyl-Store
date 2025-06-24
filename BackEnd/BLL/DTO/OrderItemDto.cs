using Domain.Entities;

namespace BLL.DTO
{
    public record OrderItemDto(
        int InventoryItemId,
        string ReleaseTitle,
        RecordCondition Condition,
        int Quantity,
        decimal UnitPrice,
        decimal LineTotal);
}
