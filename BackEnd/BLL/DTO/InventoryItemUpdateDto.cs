using Domain.Entities;

namespace Application.DTOs
{
    public record InventoryItemUpdateDto(
        decimal? Price,
        int? Quantity,
        RecordCondition? Condition,
        string? Notes,
        bool? IsActive);
}
