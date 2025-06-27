using System.Threading;
using System.Threading.Tasks;
using BLL.DTO;

namespace BLL.Services
{
    public interface ISellerProfileService
    {
        Task<SellerPageDto?> GetProfileAsync(int sellerId, CancellationToken ct = default);
        Task UpdateProfileAsync(int sellerId, SellerProfileUpdateDto dto, CancellationToken ct = default);
        Task<SellerProfileDto> CreateProfileAsync(int customerId, SellerProfileCreateDto dto, CancellationToken ct = default);
        Task<SellerPageDto?> GetCurrentUserProfileAsync(int customerId, CancellationToken ct = default);
        Task UpdateCurrentUserProfileAsync(int customerId, SellerProfileUpdateDto dto, CancellationToken ct = default);
    }
}
