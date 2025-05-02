using Application.DTOs;
using AutoMapper;
using Domain.Entities;

namespace BLL.AutoMapper
{
    public class SellerProfileProfile : Profile
    {
        public SellerProfileProfile()
        {
            CreateMap<SellerProfile, SellerProfileDto>();
        }
    }
}
