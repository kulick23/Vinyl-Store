using System;
namespace Domain.Entities
{
    public class InventoryItem : BaseEntity
    {
        public int ReleaseId { get; set; }
        public int SellerId { get; set; }
        public decimal Price { get; set; }
        public int Quantity { get; set; }
        public RecordCondition Condition { get; set; }
        public string Notes { get; set; } = string.Empty;
        public DateTime CreatedAt { get; set; } = DateTime.UtcNow;

        public RecordRelease Release { get; set; }
        public SellerProfile Seller { get; set; }
    }
}
