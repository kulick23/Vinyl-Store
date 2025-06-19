using AutoMapper;
using Domain.Entities;

public class ReviewProfile : Profile
{
    public ReviewProfile()
    {
        CreateMap<ReviewCreateDto, Review>();
        CreateMap<Review, ReviewDto>()
            .ForMember(d => d.CustomerName,
                       m => m.MapFrom(s => $"{s.Customer.FirstName} {s.Customer.LastName}".Trim()));
    }
}