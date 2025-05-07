using AutoMapper;
using Application.DTOs;
using Domain.Entities;
using BLL.DTO;

namespace BLL.AutoMapper
{
    public class ArtistProfile : Profile
    {
        public ArtistProfile()
        {
            CreateMap<Artist, ArtistDto>();
            CreateMap<ArtistDto, Artist>();
        }
    }
}
