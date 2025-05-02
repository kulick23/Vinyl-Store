using System;
using System.Threading;
using System.Threading.Tasks;
using DAL.Data;
using DAL.Interfaces;
using Domain.Entities;
using Microsoft.EntityFrameworkCore;

namespace DAL.Repositories
{
    public class PasswordResetTokenRepository : Repository<PasswordResetToken>, IPasswordResetTokenRepository
    {
        public PasswordResetTokenRepository(AppDbContext ctx) : base(ctx) { }

        public Task AddAsync(PasswordResetToken token, CancellationToken ct = default) =>
            _dbSet.AddAsync(token, ct).AsTask();

        public Task<PasswordResetToken?> GetAsync(Guid token, CancellationToken ct = default) =>
            _dbSet.Include(t => t.Customer)
                  .FirstOrDefaultAsync(t => t.Token == token, ct);

        public async Task MarkUsedAsync(Guid token, CancellationToken ct = default)
        {
            var entity = await _dbSet.FirstOrDefaultAsync(t => t.Token == token, ct);
            if (entity is not null) entity.Used = true;
        }
    }
}