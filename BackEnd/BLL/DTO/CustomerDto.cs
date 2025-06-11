namespace BLL.DTOs
{
    public record CustomerDto(
        Guid id,
        string Email,
        bool isEmailConfirmed,
        string FirstName,
        string? LastName,
        string phone,
        DateTime LastLoginAt,
        DateTime CreatedAt);
}