using Application.DTOs;
using AutoMapper;
using Domain.Entities;

namespace BLL.AutoMapper
{
    public class ReleaseProfile : Profile
    {
        public ReleaseProfile()
        {
            CreateMap<RecordRelease, ReleaseDto>()
                .ForMember(d => d.Artist, m => m.MapFrom(s => s.Artist.Name))
                .ForMember(d => d.Genre, m => m.MapFrom(s => s.Genre.Name));

            CreateMap<ReleaseDto, RecordRelease>()
                .ForMember(d => d.Artist, m => m.Ignore())
                .ForMember(d => d.Genre, m => m.Ignore());

            CreateMap<RecordRelease, ReleaseDto>()
                .ForMember(d => d.Artist,
                           opt => opt.MapFrom(s => s.Artist.Name))
                .ForMember(d => d.Genre,
                           opt => opt.MapFrom(s => s.Genre.Name));
        }
    }
}
