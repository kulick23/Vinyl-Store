using System;

namespace BLL.DTO
{
    public record PasswordResetDto(
        Guid Token,
        string NewPassword);
}

