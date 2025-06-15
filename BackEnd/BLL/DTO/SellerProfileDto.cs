namespace Application.DTOs;

public record SellerProfileDto
{
    public int Id { get; init; }
    public string DisplayName { get; init; } = string.Empty;
    public string? Description { get; init; }
    public decimal Rating { get; init; }
}
