using Domain.Entities;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace DAL.Interfaces
{
    public interface IPasswordResetTokenRepository
    {
        Task AddAsync(PasswordResetToken token, CancellationToken ct = default);
        Task<PasswordResetToken?> GetAsync(Guid token, CancellationToken ct = default);
        Task MarkUsedAsync(Guid token, CancellationToken ct = default);
    }
}
