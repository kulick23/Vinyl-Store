using BLL.DTO;
using AutoMapper;
using BLL.AutoMapper;
using Domain.Entities;
using System;
using System.Linq;
using System.Reflection;
using Xunit;

namespace Backend.Tests
{
    public class MappingProfilesTests
    {
        private readonly IMapper _mapper;

        public MappingProfilesTests()
        {
            var configuration = new MapperConfiguration(cfg =>
            {
                cfg.AddProfile<ArtistProfile>();
                cfg.AddProfile<CartProfile>();
                cfg.AddProfile<CustomerProfile>();
                cfg.AddProfile<GenreProfile>();
                cfg.AddProfile<InventoryItemProfile>();
                cfg.AddProfile<OrderProfile>();
                cfg.AddProfile<ReleaseProfile>();
                cfg.AddProfile<ReviewProfile>();
                cfg.AddProfile<SellerProfileProfile>();
            });
            _mapper = configuration.CreateMapper();
        }

        [Theory]
        [InlineData(typeof(Artist), typeof(ArtistDto))]
        [InlineData(typeof(Customer), typeof(CustomerDto))]
        [InlineData(typeof(Genre), typeof(GenreDto))]
        [InlineData(typeof(InventoryItem), typeof(InventoryItemDto))]
        [InlineData(typeof(RecordRelease), typeof(ReleaseDto))]
        [InlineData(typeof(SellerProfile), typeof(SellerProfileDto))]
        public void Map_Source_To_Destination(Type sourceType, Type destinationType)
        {
            var sourceInstance = Activator.CreateInstance(sourceType);
            var mapMethod = _mapper.GetType()
                .GetMethods(BindingFlags.Instance | BindingFlags.Public)
                .First(m => m.Name == "Map" && m.IsGenericMethod && m.GetParameters().Length == 1);

            var genericMap = mapMethod.MakeGenericMethod(destinationType);
            var result = genericMap.Invoke(_mapper, new object[] { sourceInstance });
            Assert.NotNull(result);
            Assert.IsType(destinationType, result);
        }
    }
}