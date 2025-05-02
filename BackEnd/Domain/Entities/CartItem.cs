namespace Domain.Entities
{
    public class CartItem : BaseEntity
    {
        public int CartId { get; set; }
        public int InventoryItemId { get; set; }
        public int Quantity { get; set; }

        public Cart Cart { get; set; }
        public InventoryItem InventoryItem { get; set; }
    }
}