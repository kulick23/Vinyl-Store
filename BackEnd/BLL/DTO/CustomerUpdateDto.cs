namespace BLL.DTOs
{
    public record CustomerUpdateDto(
        string Email,
        string FirstName,
        string? LastName,
        string phone);
}