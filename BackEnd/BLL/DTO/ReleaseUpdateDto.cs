using Domain.Entities;

public record ReleaseUpdateDto
{
    public string? Title { get; init; }
    public int? Year { get; init; }
    public int? ArtistId { get; init; }
    public int? GenreId { get; init; }
    public ICollection<InventoryItem>? Listings { get; init; }
}
