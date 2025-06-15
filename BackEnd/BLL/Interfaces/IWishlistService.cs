using System.Collections.Generic;
using System.Threading;
using System.Threading.Tasks;
using Application.DTOs;
using BLL.DTOs;

namespace BLL.Interfaces;

public interface IWishlistService
{
    Task<IReadOnlyList<ReleaseDto>> GetWishlistAsync(
        int userId,
        CancellationToken ct = default);

    Task AddAsync(
        int userId,
        int releaseId,
        CancellationToken ct = default);
    Task RemoveAsync(
        int userId,
        int releaseId,
        CancellationToken ct = default);
}
