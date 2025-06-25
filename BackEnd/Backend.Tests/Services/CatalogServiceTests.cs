using System.Collections.Generic;
using System.Linq;
using System.Linq.Expressions;
using System.Threading;
using System.Threading.Tasks;
using AutoMapper;
using BLL.DTO;
using BLL.Services.Implementation;
using DAL.Interfaces;
using Domain.Entities;
using FluentAssertions;
using Microsoft.EntityFrameworkCore.Query;
using Moq;
using Xunit;

namespace BLL.Tests;

public class CatalogServiceTests
{
    private readonly Mock<IRecordReleaseRepository> _releaseRepo = new();

    private readonly Mock<IInventoryItemRepository> _inventoryRepo = new();

    private readonly Mock<IGenreRepository> _genreRepo = new();

    private readonly Mock<IArtistRepository> _artistRepo = new();

    private readonly Mock<IMapper> _mapper = new();

    private CatalogService CreateSut() => new(
        _releaseRepo.Object,
        _inventoryRepo.Object,
        _genreRepo.Object,
        _artistRepo.Object,
        _mapper.Object);

    [Fact]
    public async Task GetReleaseAsync_ReturnsMappedReleaseAndListings()
    {
        var releaseEntity = new RecordRelease { Id = 1, Title = "Test Release" };

        var inventoryEntities = new List<InventoryItem> { new InventoryItem { Id = 100 } };

        var releaseDto = new ReleaseDto { Id = 1, Title = "Test Release" };

        var listingDtos = new List<InventoryItemDto>
        {
            new InventoryItemDto(100, 1, 0, "seller", 10m, 5, RecordCondition.Good, 0m, "")
        };

        _releaseRepo.Setup(r => r.Query())
                    .Returns(new TestAsyncEnumerable<RecordRelease>(new[] { releaseEntity }.AsQueryable()));

        _inventoryRepo.Setup(r => r.Query())
                      .Returns(new TestAsyncEnumerable<InventoryItem>(inventoryEntities.AsQueryable()));

        _mapper.Setup(m => m.Map<ReleaseDto>(It.IsAny<RecordRelease>()))
               .Returns(releaseDto);

        _mapper.Setup(m => m.Map<IReadOnlyList<InventoryItemDto>>(It.IsAny<IEnumerable<InventoryItem>>()))
               .Returns(listingDtos);

        var sut = CreateSut();

        var result = await sut.GetReleaseAsync(1, CancellationToken.None);

        result.Should().NotBeNull();
        result!.Release.Should().BeEquivalentTo(releaseDto);
        result.Listings.Should().NotBeNull();
        result.Listings.Should().HaveCount(1);
    }

    internal class TestAsyncQueryProvider<TEntity> : IAsyncQueryProvider
    {
        private readonly IQueryProvider _inner;

        public TestAsyncQueryProvider(IQueryProvider inner) => _inner = inner;

        public IQueryable CreateQuery(Expression e) => new TestAsyncEnumerable<TEntity>(e);

        public IQueryable<TElement> CreateQuery<TElement>(Expression e) => new TestAsyncEnumerable<TElement>(e);

        public object Execute(Expression e) => _inner.Execute(e);

        public TResult Execute<TResult>(Expression e) => _inner.Execute<TResult>(e);

        public TResult ExecuteAsync<TResult>(Expression e, CancellationToken _)
        {
            var result = _inner.Execute(e);

            var t = typeof(TResult).GetGenericArguments()[0];

            return (TResult)typeof(Task).GetMethod(nameof(Task.FromResult))!
                                        .MakeGenericMethod(t)
                                        .Invoke(null, new[] { result })!;
        }
    }

    internal class TestAsyncEnumerable<T> : EnumerableQuery<T>, IAsyncEnumerable<T>, IQueryable<T>
    {
        public TestAsyncEnumerable(IEnumerable<T> data) : base(data) { }

        public TestAsyncEnumerable(Expression expr) : base(expr) { }

        public IAsyncEnumerator<T> GetAsyncEnumerator(CancellationToken _) =>
            new TestAsyncEnumerator<T>(this.AsEnumerable().GetEnumerator());

        IQueryProvider IQueryable.Provider => new TestAsyncQueryProvider<T>(this);
    }

    internal class TestAsyncEnumerator<T> : IAsyncEnumerator<T>
    {
        private readonly IEnumerator<T> _inner;

        public TestAsyncEnumerator(IEnumerator<T> inner) => _inner = inner;

        public ValueTask DisposeAsync() => ValueTask.CompletedTask;

        public ValueTask<bool> MoveNextAsync() => new(_inner.MoveNext());

        public T Current => _inner.Current;
    }
}
