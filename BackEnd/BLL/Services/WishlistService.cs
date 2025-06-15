using Application.DTOs;
using AutoMapper;
using BLL.Interfaces;
using DAL.Interfaces;
using Microsoft.EntityFrameworkCore;

public class WishlistService : IWishlistService
{
    private readonly ICustomerRepository _custRepo;
    private readonly IRecordReleaseRepository _relRepo;
    private readonly IMapper _mapper;

    public WishlistService(ICustomerRepository c, IRecordReleaseRepository r, IMapper m)
    {
        _custRepo = c; _relRepo = r; _mapper = m;
    }

    public async Task AddAsync(int userId, int releaseId, CancellationToken ct)
    {
        var release = await _relRepo.GetByIdAsync(releaseId, ct)
                      ?? throw new KeyNotFoundException("Release not found");
        await _custRepo.AddToWishlistAsync(userId, release, ct);
    }

    public async Task RemoveAsync(int userId, int releaseId, CancellationToken ct)
        => await _custRepo.RemoveFromWishlistAsync(userId, releaseId, ct);

    public async Task<IReadOnlyList<ReleaseDto>> GetWishlistAsync(int userId, CancellationToken ct)
    {
        var list = await _relRepo.GetWishlist(userId, ct).ToListAsync(ct);
        return _mapper.Map<IReadOnlyList<ReleaseDto>>(list);
    }
}
