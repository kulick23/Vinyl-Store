using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading;
using System.Threading.Tasks;
using AutoMapper;
using BLL.DTO;
using BLL.Services;
using DAL.Interfaces;
using Domain.Entities;
using FluentAssertions;
using Moq;
using Xunit;

namespace BLL.Tests
{
    public class ReviewServiceTests
    {
        private readonly Mock<IReviewRepository> _repo = new();

        private readonly Mock<ISellerProfileRepository> _sellerRepo = new();

        private readonly Mock<IUnitOfWork> _uow = new();

        private readonly Mock<IMapper> _mapper = new();

        private ReviewService CreateSut() => new(_repo.Object, _sellerRepo.Object, _uow.Object, _mapper.Object);

        [Fact]
        public async Task AddReviewAsync_Throws_WhenNoOrdersExist()
        {
            var dto = new ReviewCreateDto(5, "meh", 2);
            var seller = new SellerProfile(); 

            _mapper.Setup(m => m.Map<Review>(dto)).Returns(new Review());

            _sellerRepo.Setup(r => r.GetByIdAsync(2, It.IsAny<CancellationToken>())).ReturnsAsync(seller);

            _repo.Setup(r => r.GetSellerReviews(2)).Returns(Enumerable.Empty<Review>().AsQueryable());

            var sut = CreateSut();
            var act = async () => await sut.AddReviewAsync(1, dto, CancellationToken.None);

            await act.Should().ThrowAsync<InvalidOperationException>().WithMessage("You have no orders with this seller.");
        }



    }


}
