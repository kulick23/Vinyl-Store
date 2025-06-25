using System.Collections.Generic;
using System.Linq;
using System.Linq.Expressions;
using System.Threading;
using System.Threading.Tasks;
using AutoMapper;
using BLL.DTO;
using BLL.Services;
using DAL.Interfaces;
using Domain.Entities;
using FluentAssertions;
using Microsoft.EntityFrameworkCore.Query;
using Moq;
using Xunit;

namespace BLL.Tests
{
    public class WishlistServiceTests
    {
        private readonly Mock<ICustomerRepository> _custRepo = new();

        private readonly Mock<IRecordReleaseRepository> _relRepo = new();

        private readonly Mock<IMapper> _mapper = new();

        private WishlistService CreateSut() => new(_custRepo.Object, _relRepo.Object, _mapper.Object);

        [Fact]
        public async Task GetWishlistAsync_ReturnsMappedReleases()
        {
            var releases = new List<RecordRelease> { new() { Id = 1 } };
            var releaseDtos = new List<ReleaseDto> { new() { Id = 1 } };
            var queryable = releases.AsQueryable();
            var asyncQueryable = new TestAsyncEnumerable<RecordRelease>(queryable);

            _relRepo.Setup(r => r.GetWishlist(1, It.IsAny<CancellationToken>())).Returns(asyncQueryable);

            _mapper.Setup(m => m.Map<IReadOnlyList<ReleaseDto>>(It.IsAny<List<RecordRelease>>())).Returns(releaseDtos);

            var result = await CreateSut().GetWishlistAsync(1, CancellationToken.None);

            result.Should().BeEquivalentTo(releaseDtos);
        }

        [Fact]
        public async Task AddAsync_CallsRepository()
        {
            var entity = new RecordRelease();

            _relRepo.Setup(r => r.GetByIdAsync(2, It.IsAny<CancellationToken>())).ReturnsAsync(entity);

            await CreateSut().AddAsync(5, 2, CancellationToken.None);

            _custRepo.Verify(r => r.AddToWishlistAsync(5, entity, It.IsAny<CancellationToken>()), Times.Once);
        }

        [Fact]
        public async Task RemoveAsync_CallsRepository()
        {
            await CreateSut().RemoveAsync(7, 3, CancellationToken.None);

            _custRepo.Verify(r => r.RemoveFromWishlistAsync(7, 3, It.IsAny<CancellationToken>()), Times.Once);
        }
    }

    internal class TestAsyncQueryProvider<TEntity> : IAsyncQueryProvider
    {
        private readonly IQueryProvider _inner;

        public TestAsyncQueryProvider(IQueryProvider inner) => _inner = inner;

        public IQueryable CreateQuery(Expression expression) => new TestAsyncEnumerable<TEntity>(expression);

        public IQueryable<TElement> CreateQuery<TElement>(Expression expression) => new TestAsyncEnumerable<TElement>(expression);

        public object Execute(Expression expression) => _inner.Execute(expression);

        public TResult Execute<TResult>(Expression expression) => _inner.Execute<TResult>(expression);


        public TResult ExecuteAsync<TResult>(Expression expression, CancellationToken _)
        {
            var result = _inner.Execute(expression);
            var resultType = typeof(TResult).GetGenericArguments()[0];

            var taskFromResult = typeof(Task)
                .GetMethod(nameof(Task.FromResult))!
                .MakeGenericMethod(resultType)
                .Invoke(null, new[] { result });

            return (TResult)taskFromResult!;
        }
    }

    internal class TestAsyncEnumerable<T> : EnumerableQuery<T>, IAsyncEnumerable<T>, IQueryable<T>
    {
        public TestAsyncEnumerable(IEnumerable<T> enumerable) : base(enumerable) { }

        public TestAsyncEnumerable(Expression expression) : base(expression) { }

        public IAsyncEnumerator<T> GetAsyncEnumerator(CancellationToken _) => new TestAsyncEnumerator<T>(this.AsEnumerable().GetEnumerator());

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
