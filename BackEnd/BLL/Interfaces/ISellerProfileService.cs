using System.Threading;
using System.Threading.Tasks;
using Application.DTOs;

namespace Application.Services
{
    public interface ISellerProfileService
    {
        Task<SellerPageDto?> GetProfileAsync(int sellerId, CancellationToken ct = default);
        Task UpdateProfileAsync(int sellerId, SellerProfileUpdateDto dto, CancellationToken ct = default);
        Task<SellerProfileDto> CreateProfileAsync(int customerId, SellerProfileCreateDto dto, CancellationToken ct = default);
    }
}
