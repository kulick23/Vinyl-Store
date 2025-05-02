using Domain.Entities;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace DAL.Interfaces
{
    public interface IEmailTokenRepository
    {
        Task AddAsync(EmailConfirmationToken token, CancellationToken ct = default);
        Task<EmailConfirmationToken?> GetAsync(Guid token, CancellationToken ct = default);
        Task MarkUsedAsync(Guid token, CancellationToken ct = default);
    }
}
