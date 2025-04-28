namespace Application.DTOs
{
    public record ReleaseDto(
        int Id,
        string Title,
        int Year,
        string Artist,
        string Genre);
}
