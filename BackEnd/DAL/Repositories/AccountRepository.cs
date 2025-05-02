using System;
using System.Linq;
using System.Threading;
using System.Threading.Tasks;
using DAL.Data;
using DAL.Interfaces;
using Domain.Entities;
using Microsoft.EntityFrameworkCore;

namespace DAL.Repositories
{
    public class AccountRepository : IAccountRepository
    {
        private readonly AppDbContext _ctx;
        private readonly DbSet<Customer> _users;
        private readonly DbSet<RefreshToken> _refresh;

        public AccountRepository(AppDbContext ctx)
        {
            _ctx = ctx;
            _users = ctx.Set<Customer>();
            _refresh = ctx.Set<RefreshToken>();
        }

        /* ---------- Customer ---------- */

        public Task<Customer?> GetByEmailAsync(string email, CancellationToken ct = default) =>
            _users.Include(u => u.SellerProfile)
                  .FirstOrDefaultAsync(u => u.Email == email, ct);

        public Task<bool> EmailExistsAsync(string email, CancellationToken ct = default) =>
            _users.AnyAsync(u => u.Email == email, ct);

        public Task AddAsync(Customer customer, CancellationToken ct = default) =>
            _users.AddAsync(customer, ct).AsTask();

        /* ---------- Refresh-токены ---------- */

        public Task AddRefreshTokenAsync(RefreshToken token, CancellationToken ct = default) =>
            _refresh.AddAsync(token, ct).AsTask();

        public Task<RefreshToken?> GetRefreshTokenAsync(string token, CancellationToken ct = default) =>
            _refresh.Include(t => t.Customer)
                    .FirstOrDefaultAsync(t => t.Token == token, ct);

        public async Task RevokeRefreshTokenAsync(string token, CancellationToken ct = default)
        {
            var rt = await _refresh.FirstOrDefaultAsync(t => t.Token == token, ct);
            if (rt is not null) rt.Revoked = true;
        }

        public async Task RevokeAllRefreshTokensAsync(int customerId, CancellationToken ct = default)
        {
            await _refresh
                .Where(t => t.CustomerId == customerId && !t.Revoked)
                .ExecuteUpdateAsync(setters => setters.SetProperty(t => t.Revoked, true), ct);
        }
    }
}