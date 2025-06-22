namespace Application.DTOs;

public record class SellerPageDto
{
    public int SellerId { get; init; }
    public string DisplayName { get; init; } = default!;
    public string? Description { get; init; }
    public decimal Rating { get; init; }
    public IReadOnlyList<ReviewDto> Reviews { get; init; } = [];
}
