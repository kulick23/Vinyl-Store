using System.Linq;
using Application.DTOs;
using AutoMapper;
using Domain.Entities;

namespace BLL.AutoMapper
{
    public class CartProfile : Profile
    {
        public CartProfile()
        {
            CreateMap<CartItem, CartItemDto>()
            .ConstructUsing(src => new CartItemDto(
                src.Id,                                      // CartItemId
                src.InventoryItemId,                         // InventoryItemId
                src.InventoryItem.Release.Title,             // ReleaseTitle
                src.InventoryItem.Price,                     // UnitPrice
                src.Quantity,                                // Quantity
                src.Quantity * src.InventoryItem.Price       // LineTotal
            ));
        }
    }
}
