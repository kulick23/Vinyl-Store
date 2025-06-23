namespace Application.DTOs;

public record class SellerProfileCreateDto
{
    public string DisplayName { get; init; } = string.Empty;
    public string? Description { get; init; }
}
