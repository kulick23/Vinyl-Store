using Domain.Entities;

namespace Application.DTOs
{
    public record SearchQueryDto(
        string? Keyword,
        int? ArtistId,
        int? GenreId,
        int? YearFrom,
        int? YearTo,
        decimal? PriceMin,
        decimal? PriceMax,
        RecordCondition? MinCondition);
}
