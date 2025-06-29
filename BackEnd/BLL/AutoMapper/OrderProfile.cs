using AutoMapper;
using BLL.DTO;
using Domain.Entities;

public sealed class OrderProfile : Profile
{
    public OrderProfile()
    {
        CreateMap<OrderItem, OrderItemDto>()
            .ForMember(d => d.InventoryItemId, c => c.MapFrom(s => s.InventoryItemId))
            .ForMember(d => d.Title, c => c.MapFrom(s => s.InventoryItem.Release.Title));

        CreateMap<Order, OrderDto>()
            .ForMember(d => d.OrderId, c => c.MapFrom(s => s.Id))
            .ForMember(d => d.Total,
                       c => c.MapFrom(s => s.OrderItems.Sum(i => i.UnitPrice * i.Quantity)));
    }
}