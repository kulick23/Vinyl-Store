using Domain.Entities;

namespace Application.DTOs
{
    public record InventoryItemCreateDto(
        int ReleaseId,
        decimal Price,
        int Quantity,
        RecordCondition Condition,
        string Notes);
}
