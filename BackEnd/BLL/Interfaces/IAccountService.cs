using System.Threading;
using System.Threading.Tasks;
using BLL.DTO;

namespace BLL.Interfaces
{
    public interface IAccountService
    {
        Task<AuthTokensDto> RegisterAsync(RegisterDto dto, CancellationToken ct = default);
        Task<AuthTokensDto> LoginAsync(LoginDto dto, CancellationToken ct = default);
        Task<AuthTokensDto> RefreshAsync(string refreshToken, CancellationToken ct = default);
        Task LogoutAsync(string refreshToken, CancellationToken ct = default);
        Task LogoutAllAsync(int customerId, CancellationToken ct = default);
        Task SendEmailConfirmationAsync(int customerId, CancellationToken ct);
        Task<bool> ConfirmEmailAsync(string rawToken, CancellationToken ct = default);
        Task<CustomerUpdateDto> GetByIdAsync(int userId, CancellationToken ct);
        Task<CustomerUpdateDto> UpdateProfileAsync(int userId, CustomerUpdateDto dto, CancellationToken ct = default);
    }
}
