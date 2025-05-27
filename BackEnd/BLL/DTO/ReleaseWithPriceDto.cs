using Domain.Entities;

namespace Application.DTOs
{
    public record ReleaseWithPriceDto
    {
        public int Id { get; init; }
        public string Title { get; init; } = default!;
        public int Year { get; init; }
        public string Artist { get; init; } = default!;
        public string Genre { get; init; } = default!;
        public string? ImageUrl { get; init; }
        public decimal? Price { get; init; }
        public RecordCondition? Condition { get; init; }
        public bool IsAvailable { get; init; }
        public int? InventoryItemId { get; init; }
    }
} 