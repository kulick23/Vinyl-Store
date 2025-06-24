using BLL.DTO;
using AutoMapper;
using Domain.Entities;

namespace BLL.AutoMapper
{
    public class SellerProfileProfile : Profile
    {
        public SellerProfileProfile()
        {
            CreateMap<SellerProfile, SellerProfileDto>();
            CreateMap<SellerProfile, SellerPageDto>();
            CreateMap<SellerProfileUpdateDto, SellerProfile>();
            CreateMap<SellerProfile, SellerProfileUpdateDto>();
            CreateMap<SellerProfileCreateDto, SellerProfile>();
        }
    }
}
