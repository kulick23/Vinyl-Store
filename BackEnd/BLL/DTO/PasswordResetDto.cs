using System;

namespace Application.DTOs
{
    public record PasswordResetDto(
        Guid Token,
        string NewPassword);
}

