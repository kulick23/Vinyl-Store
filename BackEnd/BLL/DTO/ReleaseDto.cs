namespace BLL.DTO
{
    public record ReleaseDto
    {
        public int Id { get; init; }
        public string Title { get; init; } = default!;
        public int Year { get; init; }
        public string Artist { get; init; } = default!;
        public string Genre { get; init; } = default!;
        public string? ImageUrl { get; init; } = default!;
    }
}