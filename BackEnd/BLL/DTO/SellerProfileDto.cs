namespace Application.DTOs
{
    public record SellerProfileDto(
        int SellerId,
        string DisplayName,
        string Description,
        decimal Rating);
}
