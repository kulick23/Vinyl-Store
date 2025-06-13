using System.Threading;
using System.Threading.Tasks;
using Domain.Entities;

namespace DAL.Interfaces;

public interface IEmailTokenRepository : IRepository<EmailToken>
{
    Task AddAsync(EmailToken entity, CancellationToken ct = default);
    Task<EmailToken?> GetValidAsync(string hash, CancellationToken ct = default);
    Task ConfirmAsync(string hash, CancellationToken ct = default);
}
