namespace BLL.DTOs
{
    public record CustomerUpdateDto(
        string Email,
        bool isEmailConfirmed,
        string FirstName,
        string? LastName,
        string phone);
}