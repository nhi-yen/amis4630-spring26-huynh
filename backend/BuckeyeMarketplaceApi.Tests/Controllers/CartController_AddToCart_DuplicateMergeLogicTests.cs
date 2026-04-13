using System.Linq.Expressions;
using System.Security.Claims;
using BuckeyeMarketplaceApi.Controllers;
using BuckeyeMarketplaceApi.Data;
using BuckeyeMarketplaceApi.Dtos;
using BuckeyeMarketplaceApi.Models;
using FluentAssertions;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Query;
using Moq;
using Xunit;

namespace BuckeyeMarketplaceApi.Tests.Controllers
{
    public class CartController_AddToCart_DuplicateMergeLogicTests
    {
        [Fact(DisplayName = "AddToCart_WithExistingProduct_MergesQuantityWithoutDuplicateLineItem")]
        public async Task AddToCart_WithExistingProduct_MergesQuantityWithoutDuplicateLineItem()
        {
            // Arrange
            var userId = "user-1";
            var product = new Product
            {
                Id = 1,
                Title = "Widget",
                Price = 10m,
                Description = "desc",
                Category = "cat",
                SellerName = "seller",
                ImageUrl = "https://example.com/img.png",
                Condition = "Good",
                PostedDate = DateTime.UtcNow
            };

            var existingItem = new CartItem
            {
                Id = 11,
                ProductId = 1,
                Quantity = 1
            };

            var cart = new Cart
            {
                Id = 7,
                UserId = userId,
                Items = new List<CartItem> { existingItem }
            };

            var productsSet = BuildProductDbSet(new List<Product> { product });
            var cartsSet = BuildAsyncDbSet(new List<Cart> { cart });

            var context = new FakeMarketplaceContext();
            context.Products = productsSet.Object;
            context.Carts = cartsSet.Object;

            var controller = new CartController(context);
            controller.ControllerContext = BuildControllerContextWithUser(userId);

            var request = new AddToCartRequest
            {
                ProductId = 1,
                Quantity = 2
            };

            // Act
            var result = await controller.AddToCart(request);

            // Assert
            var created = result.Result.Should().BeOfType<CreatedAtActionResult>().Subject;
            created.ActionName.Should().Be(nameof(CartController.GetCart));

            var response = created.Value.Should().BeOfType<CartItemResponse>().Subject;
            response.ProductId.Should().Be(1);
            response.Quantity.Should().Be(3); // 1 existing + 2 added
            response.LineTotal.Should().Be(30m);

            cart.Items.Should().HaveCount(1);
            cart.Items.Single(i => i.ProductId == 1).Quantity.Should().Be(3);

            context.SaveChangesCallCount.Should().Be(1);
        }

        private static ControllerContext BuildControllerContextWithUser(string userId)
        {
            var claimsPrincipal = new ClaimsPrincipal(
                new ClaimsIdentity(new[] { new Claim(ClaimTypes.NameIdentifier, userId) }, "TestAuth"));

            return new ControllerContext
            {
                HttpContext = new DefaultHttpContext
                {
                    User = claimsPrincipal
                }
            };
        }

        private static Mock<DbSet<Product>> BuildProductDbSet(IReadOnlyCollection<Product> data)
        {
            var set = BuildAsyncDbSet(data);
            set.Setup(s => s.FindAsync(It.IsAny<object[]>()))
               .Returns<object[]>(keys =>
               {
                   var id = (int)keys[0];
                   var match = data.FirstOrDefault(p => p.Id == id);
                   return new ValueTask<Product?>(match);
               });
            return set;
        }

        private static Mock<DbSet<T>> BuildAsyncDbSet<T>(IReadOnlyCollection<T> data) where T : class
        {
            var queryable = data.AsQueryable();

            var mockSet = new Mock<DbSet<T>>();
            mockSet.As<IAsyncEnumerable<T>>()
                .Setup(m => m.GetAsyncEnumerator(It.IsAny<CancellationToken>()))
                .Returns(new TestAsyncEnumerator<T>(queryable.GetEnumerator()));

            mockSet.As<IQueryable<T>>().Setup(m => m.Provider).Returns(new TestAsyncQueryProvider<T>(queryable.Provider));
            mockSet.As<IQueryable<T>>().Setup(m => m.Expression).Returns(queryable.Expression);
            mockSet.As<IQueryable<T>>().Setup(m => m.ElementType).Returns(queryable.ElementType);
            mockSet.As<IQueryable<T>>().Setup(m => m.GetEnumerator()).Returns(() => queryable.GetEnumerator());

            return mockSet;
        }

        private sealed class FakeMarketplaceContext : MarketplaceContext
        {
            public int SaveChangesCallCount { get; private set; }

            public FakeMarketplaceContext()
                : base(new DbContextOptionsBuilder<MarketplaceContext>().Options)
            {
            }

            public override Task<int> SaveChangesAsync(CancellationToken cancellationToken = default)
            {
                SaveChangesCallCount++;
                return Task.FromResult(1);
            }
        }

        private sealed class TestAsyncQueryProvider<T> : IAsyncQueryProvider
        {
            private readonly IQueryProvider _inner;

            public TestAsyncQueryProvider(IQueryProvider inner)
            {
                _inner = inner;
            }

            public IQueryable CreateQuery(Expression expression)
                => new EnumerableQuery<T>(expression);

            public IQueryable<TElement> CreateQuery<TElement>(Expression expression)
                => new EnumerableQuery<TElement>(expression);

            public object? Execute(Expression expression)
            {
                var rewritten = new StripIncludeExpressionVisitor().Visit(expression)!;
                return _inner.Execute(rewritten);
            }

            public TResult Execute<TResult>(Expression expression)
            {
                var rewritten = new StripIncludeExpressionVisitor().Visit(expression)!;
                return _inner.Execute<TResult>(rewritten);
            }

            public TResult ExecuteAsync<TResult>(Expression expression, CancellationToken cancellationToken = default)
            {
                var rewritten = new StripIncludeExpressionVisitor().Visit(expression)!;
                var expectedType = typeof(TResult).GetGenericArguments().First();
                var executionResult = typeof(IQueryProvider)
                    .GetMethods()
                    .Single(m => m.Name == nameof(IQueryProvider.Execute) && m.IsGenericMethod)
                    .MakeGenericMethod(expectedType)
                    .Invoke(_inner, new object[] { rewritten });

                return (TResult)typeof(Task)
                    .GetMethod(nameof(Task.FromResult))!
                    .MakeGenericMethod(expectedType)
                    .Invoke(null, new[] { executionResult })!;
            }
        }

        private sealed class TestAsyncEnumerator<T> : IAsyncEnumerator<T>
        {
            private readonly IEnumerator<T> _inner;
            public TestAsyncEnumerator(IEnumerator<T> inner) { _inner = inner; }
            public T Current => _inner.Current;
            public ValueTask DisposeAsync() { _inner.Dispose(); return ValueTask.CompletedTask; }
            public ValueTask<bool> MoveNextAsync() => new(_inner.MoveNext());
        }

        private sealed class StripIncludeExpressionVisitor : ExpressionVisitor
        {
            protected override Expression VisitMethodCall(MethodCallExpression node)
            {
                if (node.Method.DeclaringType == typeof(EntityFrameworkQueryableExtensions) &&
                    (node.Method.Name == nameof(EntityFrameworkQueryableExtensions.Include) ||
                     node.Method.Name == nameof(EntityFrameworkQueryableExtensions.ThenInclude)))
                {
                    return Visit(node.Arguments[0]);
                }

                return base.VisitMethodCall(node);
            }
        }
    }
}
