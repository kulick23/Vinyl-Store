using Domain.Entities;

namespace BLL.DTO
{
    public record InventoryItemUpdateDto(
        decimal? Price,
        int? Quantity,
        RecordCondition? Condition,
        string? Notes,
        bool? IsActive);
}
