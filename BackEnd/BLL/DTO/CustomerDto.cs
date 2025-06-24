namespace BLL.DTO
{
    public record class CustomerDto
    {
        public int Id { get; init; }
        public string Email { get; init; } = default!;
        public string FirstName { get; init; } = default!;
        public string LastName { get; init; } = default!;
        public string? Phone { get; init; }
        public bool IsEmailConfirmed { get; init; }
    }
}