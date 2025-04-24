namespace Domain.Entities
{
    public class CartItem : BaseEntity
    {
        public int CustomerId { get; set; }
        public int InventoryItemId { get; set; }
        public int Quantity { get; set; }

        public Customer Customer { get; set; }
        public InventoryItem InventoryItem { get; set; }
    }
}
