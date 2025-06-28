namespace BLL.DTO;

public sealed record PasswordResetRequestDto(string Email);

public sealed record PasswordResetConfirmDto(Guid Token, string NewPassword);