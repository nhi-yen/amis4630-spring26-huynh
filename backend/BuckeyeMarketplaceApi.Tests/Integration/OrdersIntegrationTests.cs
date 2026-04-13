using System.Security.Claims;
using FluentAssertions;
using BuckeyeMarketplaceApi.Controllers;
using BuckeyeMarketplaceApi.Data;
using BuckeyeMarketplaceApi.Dtos;
using BuckeyeMarketplaceApi.Models;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Mvc.Testing;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.DependencyInjection;
using Microsoft.Extensions.DependencyInjection.Extensions;
using Xunit;

namespace BuckeyeMarketplaceApi.Tests
{
    public class OrdersIntegrationTests
    {
        private const string TestUserId = "test-user-id";

        [Fact(DisplayName = "CreateOrder_ThenRetrieveOrderHistory_Succeeds")]
        public async Task CreateOrder_ThenRetrieveOrderHistory_Succeeds()
        {
            // ARRANGE
            await using var factory = new CustomWebApplicationFactory();
            using var scope = factory.Services.CreateScope();
            var context = scope.ServiceProvider.GetRequiredService<MarketplaceContext>();
            await context.Database.EnsureCreatedAsync();

            var selectedProduct = await SeedProductAsync(context);
            const int quantity = 2;
            await SeedCartAsync(context, selectedProduct.Id, quantity);

            var ordersController = new OrdersController(context)
            {
                ControllerContext = BuildAuthenticatedControllerContext(scope.ServiceProvider)
            };

            var createResult = await ordersController.CreateOrder(new CreateOrderRequest
            {
                ShippingAddress = "123 Test Street"
            });

            var createdOrderResult = createResult.Result as OkObjectResult;
            createdOrderResult.Should().NotBeNull();

            var createdOrder = createdOrderResult!.Value as OrderResponse;
            createdOrder.Should().NotBeNull();
            createdOrder!.OrderId.Should().BeGreaterThan(0);
            createdOrder.ConfirmationNumber.Should().NotBeNullOrWhiteSpace();
            createdOrder.Items.Should().HaveCount(1);
            createdOrder.Items[0].ProductId.Should().Be(selectedProduct.Id);
            createdOrder.Items[0].Quantity.Should().Be(quantity);
            createdOrder.Items[0].UnitPrice.Should().Be(selectedProduct.Price);
            createdOrder.Total.Should().Be(quantity * selectedProduct.Price);

            var historyResult = await ordersController.GetMyOrders();
            var historyOkResult = historyResult.Result as OkObjectResult;
            historyOkResult.Should().NotBeNull();

            var myOrders = historyOkResult!.Value as List<OrderResponse>;
            myOrders.Should().NotBeNull();
            myOrders.Should().HaveCount(1);
            var historyOrder = myOrders!.Single();
            historyOrder.OrderId.Should().Be(createdOrder.OrderId);
            historyOrder.Total.Should().Be(createdOrder.Total);
            historyOrder.Items.Should().HaveCount(1);
            historyOrder.Items[0].ProductId.Should().Be(createdOrder.Items[0].ProductId);
            historyOrder.Items[0].Quantity.Should().Be(createdOrder.Items[0].Quantity);
            historyOrder.Items[0].UnitPrice.Should().Be(createdOrder.Items[0].UnitPrice);

            var cartController = new CartController(context)
            {
                ControllerContext = BuildAuthenticatedControllerContext(scope.ServiceProvider)
            };

            var cartResult = await cartController.GetCart();
            var cartOkResult = cartResult.Result as OkObjectResult;
            cartOkResult.Should().NotBeNull();

            var cart = cartOkResult!.Value as BuckeyeMarketplaceApi.Dtos.CartResponse;
            cart.Should().NotBeNull();
            cart!.Items.Should().HaveCount(0);
        }

        private static ControllerContext BuildAuthenticatedControllerContext(IServiceProvider serviceProvider)
        {
            return new ControllerContext
            {
                HttpContext = new DefaultHttpContext
                {
                    RequestServices = serviceProvider,
                    User = new ClaimsPrincipal(new ClaimsIdentity(new[]
                    {
                        new Claim(ClaimTypes.NameIdentifier, TestUserId),
                        new Claim(ClaimTypes.Role, "User"),
                        new Claim(ClaimTypes.Email, "test-user@example.com")
                    }, "TestAuth"))
                }
            };
        }

        private static async Task<ProductResponse> SeedProductAsync(MarketplaceContext context)
        {
            var product = new Product
            {
                Title = "Integration Test Product",
                Description = "Used for OrdersIntegrationTests",
                Price = 24.50m,
                Category = "Test",
                SellerName = "Test Seller",
                ImageUrl = "https://example.com/test-product.jpg",
                Condition = "Good",
                PostedDate = DateTime.UtcNow
            };

            context.Products.Add(product);
            await context.SaveChangesAsync();

            return new ProductResponse
            {
                Id = product.Id,
                Price = product.Price
            };
        }

        private static async Task SeedCartAsync(MarketplaceContext context, int productId, int quantity)
        {
            var cart = new Cart
            {
                UserId = TestUserId,
                Items = new List<CartItem>
                {
                    new()
                    {
                        ProductId = productId,
                        Quantity = quantity
                    }
                }
            };

            context.Carts.Add(cart);
            await context.SaveChangesAsync();
        }

        private sealed class CustomWebApplicationFactory : WebApplicationFactory<Program>
        {
            private readonly string _databaseName = $"BuckeyeMarketplaceTests_{Guid.NewGuid():N}";

            protected override void ConfigureWebHost(Microsoft.AspNetCore.Hosting.IWebHostBuilder builder)
            {
                builder.ConfigureAppConfiguration((_, configBuilder) =>
                {
                    var settings = new Dictionary<string, string?>
                    {
                        ["Jwt:Key"] = "ThisIsATestJwtKeyWithAtLeast32Chars!123"
                    };
                    configBuilder.AddInMemoryCollection(settings);
                });

                builder.ConfigureServices(services =>
                {
                    services.RemoveAll(typeof(DbContextOptions<MarketplaceContext>));
                    services.AddDbContext<MarketplaceContext>(options =>
                    {
                        options.UseInMemoryDatabase(_databaseName);
                    });
                });
            }
        }

        private sealed class ProductResponse
        {
            public int Id { get; set; }
            public decimal Price { get; set; }
        }

    }
}
