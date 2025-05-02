using System.Threading;
using System.Threading.Tasks;
using BLL.DTOs;

namespace BLL.Interfaces
{
    public interface IAccountService
    {
        Task<AuthTokensDto> RegisterAsync(RegisterDto dto, CancellationToken ct = default);
        Task<AuthTokensDto> LoginAsync(LoginDto dto, CancellationToken ct = default);
        Task<AuthTokensDto> RefreshAsync(string refreshToken, CancellationToken ct = default);
        Task LogoutAsync(string refreshToken, CancellationToken ct = default);
        Task LogoutAllAsync(int customerId, CancellationToken ct = default);
    }
}
