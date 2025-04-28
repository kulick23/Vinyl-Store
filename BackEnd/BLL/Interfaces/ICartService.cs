using System.Collections.Generic;
using System.Threading;
using System.Threading.Tasks;
using Application.DTOs;

namespace Application.Services
{
    public interface ICartService
    {
        Task<CartDto> GetCartAsync(int customerId, CancellationToken ct = default);
        Task AddItemAsync(int customerId, int inventoryItemId, int quantity, CancellationToken ct = default);
        Task UpdateQuantityAsync(int customerId, int cartItemId, int quantity, CancellationToken ct = default);
        Task RemoveItemAsync(int customerId, int cartItemId, CancellationToken ct = default);
        Task ClearAsync(int customerId, CancellationToken ct = default);
        Task MergeGuestCartAsync(int customerId, IEnumerable<GuestCartItemDto> guestItems, CancellationToken ct = default);
    }
}
