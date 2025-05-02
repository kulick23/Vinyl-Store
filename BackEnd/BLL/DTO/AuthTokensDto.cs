using System;

namespace BLL.DTOs
{
    public record AuthTokensDto(
        string AccessToken,
        string RefreshToken,
        DateTime AccessExpiresAt);
}
