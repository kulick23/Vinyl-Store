using Domain.Entities;

namespace Application.DTOs
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
