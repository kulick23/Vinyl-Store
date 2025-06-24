using BLL.DTO;
using AutoMapper;
using Domain.Entities;

namespace BLL.AutoMapper
{
    public class InventoryItemProfile : Profile
    {
        public InventoryItemProfile()
        {
            CreateMap<InventoryItem, InventoryItemDto>()
                .ForMember(d => d.SellerDisplayName, m => m.MapFrom(s => s.Seller.DisplayName))
                .ForMember(d => d.SellerRating, m => m.MapFrom(s => s.Seller.Rating));

            CreateMap<InventoryItemCreateDto, InventoryItem>();
            CreateMap<InventoryItemUpdateDto, InventoryItem>()
                .ForAllMembers(opts => opts.Condition((src, dest, val) => val != null));
        }
    }
}
