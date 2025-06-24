using System;

namespace BLL.DTO
{
    public record AuthTokensDto(
        string AccessToken,
        string RefreshToken,
        DateTime AccessExpiresAt);
}
