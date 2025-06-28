namespace Domain.Entities
{
    public class Cart : BaseEntity
    {
        public int? CustomerId { get; set; }
        public string? SessionKey { get; set; }

        public DateTime CreatedAt { get; set; } = DateTime.UtcNow;
        public DateTime UpdatedAt { get; set; } = DateTime.UtcNow;

        public Customer? Customer { get; set; }
        public ICollection<CartItem> Items { get; set; } = new List<CartItem>();

        public string? StripePaymentIntentId { get; set; }
    }
}