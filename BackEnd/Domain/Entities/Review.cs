namespace Domain.Entities;

public class Review : BaseEntity
{
    public int SellerId { get; set; }
    public int CustomerId { get; set; }

    public byte Rating { get; set; }
    public string Comment { get; set; } = string.Empty;
    public DateTime Created { get; set; } = DateTime.UtcNow;

    public SellerProfile Seller { get; set; } = null!;
    public Customer Customer { get; set; } = null!;
}
