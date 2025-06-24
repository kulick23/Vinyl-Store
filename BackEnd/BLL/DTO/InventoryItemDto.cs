using Domain.Entities;

namespace BLL.DTO
{
    public record InventoryItemDto(
        int Id,
        int ReleaseId,
        int SellerId,
        string SellerDisplayName,
        decimal Price,
        int Quantity,
        RecordCondition Condition,
        decimal SellerRating,
        string Notes);
}
