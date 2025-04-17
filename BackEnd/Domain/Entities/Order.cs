namespace Domain.Entities
{
    public class Order : BaseEntity
    {
        public required DateTime OrderDate { get; set; }
        public required int CustomerId { get; set; }
        public Customer Customer { get; set; }
        public ICollection<OrderItem> OrderItems { get; set; }

    }
}
