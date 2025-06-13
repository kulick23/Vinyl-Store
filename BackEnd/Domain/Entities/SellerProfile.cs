using System.Collections.Generic;

namespace Domain.Entities
{
    public class SellerProfile : BaseEntity
    {
        public int CustomerId { get; set; }
        public string DisplayName { get; set; } = string.Empty;
        public string Description { get; set; } = string.Empty;
        public decimal Rating { get; set; }

        public Customer Customer { get; set; }
        public ICollection<InventoryItem> Listings { get; set; } = [];
    }
}
