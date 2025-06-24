using BLL.DTO;
using AutoMapper;
using Domain.Entities;

namespace BLL.AutoMapper
{
    public class OrderProfile : Profile
    {
        public OrderProfile()
        {
            CreateMap<Order, OrderDto>()
                .ForMember(d => d.OrderId, m => m.MapFrom(s => s.Id))
                .ForMember(d => d.Total, m => m.MapFrom(s => s.OrderItems.Sum(i => i.Quantity * i.UnitPrice)));

            CreateMap<OrderItem, OrderItemDto>()
                .ForMember(d => d.ReleaseTitle, m => m.MapFrom(s => s.InventoryItem.Release.Title));
        }
    }
}
