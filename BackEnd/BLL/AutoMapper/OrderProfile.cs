using BLL.DTO;
using AutoMapper;
using Domain.Entities;
using Application.DTOs;

namespace BLL.AutoMapper
{
    public class OrderProfile : Profile
    {
        public OrderProfile()
        {
            CreateMap<OrderItem, OrderItemDto>()
                .ForMember(d => d.ReleaseTitle, m => m.MapFrom(s => s.InventoryItem.Release.Title));

            CreateMap<Order, OrderDto>()
                .ForMember(d => d.OrderId, m => m.MapFrom(s => s.Id))
                .ForMember(d => d.Total, m => m.MapFrom(
                    s => s.OrderItems.Sum(i => i.UnitPrice * i.Quantity)))
                .ForMember(d => d.Items, m => m.MapFrom(s => s.OrderItems));
        }
    }
}
