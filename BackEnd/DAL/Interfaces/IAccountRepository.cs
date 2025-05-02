using Domain.Entities;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace DAL.Interfaces
{
    public interface IAccountRepository
    {
        Task<Customer?> GetByEmailAsync(string email, CancellationToken ct = default);
        Task<bool> EmailExistsAsync(string email, CancellationToken ct = default);
        Task AddAsync(Customer customer, CancellationToken ct = default);

        //Tokensы
        Task AddRefreshTokenAsync(RefreshToken token, CancellationToken ct = default);
        Task<RefreshToken?> GetRefreshTokenAsync(string token, CancellationToken ct = default);
        Task RevokeRefreshTokenAsync(string token, CancellationToken ct = default);
        Task RevokeAllRefreshTokensAsync(int customerId, CancellationToken ct = default);
    }
}
