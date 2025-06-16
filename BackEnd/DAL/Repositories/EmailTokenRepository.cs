using System.Threading;
using System.Threading.Tasks;
using DAL.Data;
using DAL.Interfaces;
using Domain.Entities;
using Microsoft.EntityFrameworkCore;

namespace DAL.Repositories;

public sealed class EmailTokenRepository(AppDbContext ctx)
    : Repository<EmailToken>(ctx), IEmailTokenRepository
{
    public Task AddAsync(EmailToken entity, CancellationToken ct = default) =>
        _dbSet.AddAsync(entity, ct).AsTask();

    public Task<EmailToken?> GetValidAsync(
        string hash,
        CancellationToken ct = default) =>
        _dbSet.Include(t => t.Customer)
              .FirstOrDefaultAsync(t =>
                     t.TokenHash == hash
                 && t.ConfirmedAt == null
                 && t.ExpiresAt > DateTime.UtcNow, ct);

    public async Task ConfirmAsync(string hash, CancellationToken ct = default)
    {
        var entity = await _dbSet.FirstOrDefaultAsync(
            t => t.TokenHash == hash && t.ConfirmedAt == null, ct);

        if (entity is not null)
            entity.ConfirmedAt = DateTime.UtcNow;
    }
}
