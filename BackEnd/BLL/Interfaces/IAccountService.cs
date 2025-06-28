using BLL.DTO;
using Domain.Entities;
using System.Threading;
using System.Threading.Tasks;

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
        Task<Customer> GetUserByEmailAsync(string email, CancellationToken ct);
        Task<Customer> RegisterGoogleUserAsync(string email, string firstName, string lastName, CancellationToken ct);
        Task<AuthTokensDto> GenerateTokensForUserAsync(Customer user, CancellationToken ct);
    }
}
