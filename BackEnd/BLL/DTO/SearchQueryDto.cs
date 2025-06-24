using Domain.Entities;

namespace BLL.DTO
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
