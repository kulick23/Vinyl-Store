using AutoMapper;
using Domain.Entities;
using BLL.DTO;

namespace BLL.AutoMapper
{
    public class GenreProfile : Profile
    {
        public GenreProfile()
        {
            CreateMap<Genre, GenreDto>();
            CreateMap<GenreDto, Genre>();
        }
    }
}
