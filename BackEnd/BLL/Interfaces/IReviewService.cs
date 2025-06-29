using BLL.DTO;

namespace BLL.Interfaces
{
    public interface IReviewService
    {
        Task<ReviewDto> AddReviewAsync(int customerId, ReviewCreateDto dto, CancellationToken ct);
        Task<IReadOnlyList<ReviewDto>> GetSellerReviewsAsync(int sellerId, CancellationToken ct);
    }
}