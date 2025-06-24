using Domain.Entities;

namespace BLL.DTO
{
    public record InventoryItemCreateDto(
        int ReleaseId,
        decimal Price,
        int Quantity,
        RecordCondition Condition,
        string Notes);
}
