using System.Security.Claims;
using BuckeyeMarketplaceApi.Controllers;
using BuckeyeMarketplaceApi.Data;
using BuckeyeMarketplaceApi.Dtos;
using BuckeyeMarketplaceApi.Models;
using FluentAssertions;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using Moq;
using Xunit;

namespace BuckeyeMarketplaceApi.Tests.Controllers
{
    public class CartController_AddToCart_ProductNotFoundTests
    {
        [Fact(DisplayName = "AddToCart_WhenProductDoesNotExist_ReturnsNotFound")]
        public async Task AddToCart_WhenProductDoesNotExist_ReturnsNotFound()
        {
            // Arrange
            var productsSet = new Mock<DbSet<Product>>();
            productsSet.Setup(s => s.FindAsync(It.IsAny<object[]>()))
                       .Returns<object[]>(keys => new ValueTask<Product?>((Product?)null));

            var context = new FakeMarketplaceContext();
            context.Products = productsSet.Object;

            var controller = new CartController(context);
            controller.ControllerContext = BuildControllerContextWithUser("user-1");

            var request = new AddToCartRequest
            {
                ProductId = 999,
                Quantity = 2
            };

            // Act
            var result = await controller.AddToCart(request);

            // Assert
            var notFound = result.Result.Should().BeOfType<NotFoundObjectResult>().Subject;
            notFound.StatusCode.Should().Be(404);
            notFound.Value.Should().Be("Product not found");

            context.SaveChangesCallCount.Should().Be(0);
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
    }
}
