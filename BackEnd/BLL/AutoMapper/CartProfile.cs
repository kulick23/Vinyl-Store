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
                .ForMember(d => d.CartItemId, m => m.MapFrom(s => s.Id))
                .ForMember(d => d.InventoryItemId, m => m.MapFrom(s => s.InventoryItemId))
                .ForMember(d => d.ReleaseTitle, m => m.MapFrom(s => s.InventoryItem.Release.Title))
                .ForMember(d => d.UnitPrice, m => m.MapFrom(s => s.InventoryItem.Price))
                .ForMember(d => d.LineTotal, m => m.MapFrom(s => s.Quantity * s.InventoryItem.Price));
        }
    }
}
