using BLL.DTO;
using BLL.Services;
using AutoMapper;
using DAL.Interfaces;
using Domain.Entities;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace BLL.Services
{
    public class CartService : ICartService
    {
        private readonly ICartRepository _cartRepo;
        private readonly ICartItemRepository _cartItemRepo;
        private readonly IInventoryItemRepository _inventoryRepo;
        private readonly IUnitOfWork _uow;
        private readonly IMapper _mapper;

        public CartService(ICartRepository cartRepo,
                           ICartItemRepository cartItemRepo,
                           IInventoryItemRepository inventoryRepo,
                           IUnitOfWork uow,
                           IMapper mapper)
        {
            _cartRepo = cartRepo;
            _cartItemRepo = cartItemRepo;
            _inventoryRepo = inventoryRepo;
            _uow = uow;
            _mapper = mapper;
        }

        public async Task<CartDto> GetCartAsync(int customerId, CancellationToken ct = default)
        {
            var cart = await _cartRepo.GetByCustomerAsync(customerId, ct)
                       ?? await _cartRepo.CreateAsync(customerId, null, ct);

            var itemsDto = _mapper.Map<IReadOnlyList<CartItemDto>>(cart.Items);
            var total = itemsDto.Sum(i => i.LineTotal);
            return new CartDto(itemsDto, total);
        }

        public async Task AddItemAsync(int customerId, int invItemId, int qty, CancellationToken ct = default)
        {
            var cart = await _cartRepo.GetByCustomerAsync(customerId, ct);
            if (cart is null)
            {
                cart = await _cartRepo.CreateAsync(customerId, null, ct);
                await _uow.SaveChangesAsync(ct);
            }


            var exists = cart.Items.FirstOrDefault(i => i.InventoryItemId == invItemId);
            if (exists is null)
            {
                cart.Items.Add(new CartItem { InventoryItemId = invItemId, Quantity = qty });
            }
            else
            {
                exists.Quantity += qty;
            }

            await _uow.SaveChangesAsync(ct);
        }

        public async Task UpdateQuantityAsync(int customerId, int cartItemId, int quantity, CancellationToken ct = default)
        {
            var cart = await _cartRepo.GetByCustomerAsync(customerId, ct)
                      ?? throw new InvalidOperationException("Cart not found");

            var item = cart.Items.FirstOrDefault(i => i.Id == cartItemId)
                       ?? throw new InvalidOperationException("Item not found");

            if (quantity <= 0)
                cart.Items.Remove(item);
            else
                item.Quantity = quantity;

            await _uow.SaveChangesAsync(ct);
        }

        public async Task RemoveItemAsync(int customerId, int cartItemId, CancellationToken ct = default)
        {
            await UpdateQuantityAsync(customerId, cartItemId, 0, ct);
        }

        public async Task ClearAsync(int customerId, CancellationToken ct = default)
        {
            var cart = await _cartRepo.GetByCustomerAsync(customerId, ct);
            if (cart is null) return;
            cart.Items.Clear();
            await _uow.SaveChangesAsync(ct);
        }

        public async Task MergeGuestCartAsync(int customerId, IEnumerable<GuestCartItemDto> guestItems, CancellationToken ct = default)
        {
            var cart = await _cartRepo.GetByCustomerAsync(customerId, ct)
                       ?? await _cartRepo.CreateAsync(customerId, null, ct);

            foreach (var guest in guestItems)
            {
                var existing = cart.Items.FirstOrDefault(i => i.InventoryItemId == guest.InventoryItemId);
                if (existing is null)
                {
                    cart.Items.Add(new CartItem
                    {
                        InventoryItemId = guest.InventoryItemId,
                        Quantity = guest.Quantity
                    });
                }
                else
                {
                    existing.Quantity += guest.Quantity;
                }
            }

            await _uow.SaveChangesAsync(ct);
        }
    }
}
