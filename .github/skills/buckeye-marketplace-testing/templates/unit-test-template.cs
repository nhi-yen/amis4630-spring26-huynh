using Xunit;
using Moq;
using FluentAssertions;
using BuckeyeMarketplaceApi.Controllers;
using BuckeyeMarketplaceApi.Data;
using BuckeyeMarketplaceApi.Models;
using BuckeyeMarketplaceApi.Dtos;
using Microsoft.EntityFrameworkCore;

namespace BuckeyeMarketplaceApi.Tests.Controllers
{
    /// <summary>
    /// Unit tests for CartController using xUnit + Moq + FluentAssertions.
    /// Pattern: Arrange-Act-Assert (AAA)
    /// 
    /// CRITICAL: Never weaken assertions to make tests pass.
    /// If a test fails, the code is wrong—fix the code, not the test.
    /// </summary>
    public class CartControllerTests
    {
        /// <summary>
        /// Helper method to create an InMemory MarketplaceContext for testing.
        /// Each test gets a fresh, isolated database.
        /// </summary>
        private MarketplaceContext CreateTestContext()
        {
            var options = new DbContextOptionsBuilder<MarketplaceContext>()
                .UseInMemoryDatabase(databaseName: Guid.NewGuid().ToString())
                .Options;
            
            return new MarketplaceContext(options);
        }

        [Fact(DisplayName = "GetCart_WithNoExistingCart_CreatesNewCart")]
        public async Task GetCart_WithNoExistingCart_CreatesNewCart()
        {
            // ARRANGE
            var context = CreateTestContext();
            var controller = new CartController(context);
            
            // ACT
            var result = await controller.GetCart();
            
            // ASSERT
            result.Should().NotBeNull();
            var okResult = result.Result as OkObjectResult;
            okResult.Should().NotBeNull();
            
            var cartResponse = okResult?.Value as CartResponse;
            cartResponse.Should().NotBeNull();
            cartResponse!.UserId.Should().Be("default-user");
            cartResponse.Items.Should().BeEmpty();
            cartResponse.TotalItems.Should().Be(0);
            cartResponse.Subtotal.Should().Be(0);
        }

        [Fact(DisplayName = "AddToCart_WithNewProduct_AddsProductToCart")]
        public async Task AddToCart_WithNewProduct_AddsProductToCart()
        {
            // ARRANGE
            var context = CreateTestContext();
            var product = new Product 
            { 
                Id = 1, 
                Title = "Test Widget", 
                Price = 29.99m,
                Description = "A test widget",
                ImageUrl = "https://example.com/widget.jpg"
            };
            context.Products.Add(product);
            await context.SaveChangesAsync();
            
            var controller = new CartController(context);
            var request = new AddToCartRequest { ProductId = 1, Quantity = 2 };
            
            // ACT
            var result = await controller.AddToCart(request);
            
            // ASSERT
            result.Should().NotBeNull();
            var okResult = result.Result as OkObjectResult;
            okResult.Should().NotBeNull();
            
            var cartItem = okResult?.Value as CartItemResponse;
            cartItem.Should().NotBeNull();
            cartItem!.ProductId.Should().Be(1);
            cartItem.Quantity.Should().Be(2);
            cartItem.LineTotal.Should().Be(59.98m); // 29.99 * 2
        }

        [Fact(DisplayName = "AddToCart_WithExistingProduct_IncrementsQuantity")]
        public async Task AddToCart_WithExistingProduct_IncrementsQuantity()
        {
            // ARRANGE
            var context = CreateTestContext();
            
            // Set up existing cart with product
            var product = new Product 
            { 
                Id = 1, 
                Title = "Test Widget", 
                Price = 29.99m,
                Description = "A test widget",
                ImageUrl = "https://example.com/widget.jpg"
            };
            var cart = new Cart { UserId = "default-user" };
            var cartItem = new CartItem { Cart = cart, Product = product, ProductId = 1, Quantity = 2 };
            
            context.Products.Add(product);
            context.Carts.Add(cart);
            context.CartItems.Add(cartItem);
            await context.SaveChangesAsync();
            
            var controller = new CartController(context);
            var request = new AddToCartRequest { ProductId = 1, Quantity = 3 };
            
            // ACT
            var result = await controller.AddToCart(request);
            
            // ASSERT
            result.Should().NotBeNull();
            var okResult = result.Result as OkObjectResult;
            okResult.Should().NotBeNull();
            
            var updatedItem = okResult?.Value as CartItemResponse;
            updatedItem.Should().NotBeNull();
            updatedItem!.Quantity.Should().Be(5); // 2 existing + 3 added
        }

        [Fact(DisplayName = "AddToCart_WithNonExistentProduct_ReturnsNotFound")]
        public async Task AddToCart_WithNonExistentProduct_ReturnsNotFound()
        {
            // ARRANGE
            var context = CreateTestContext();
            var controller = new CartController(context);
            var request = new AddToCartRequest { ProductId = 999, Quantity = 1 };
            
            // ACT
            var result = await controller.AddToCart(request);
            
            // ASSERT
            result.Result.Should().BeOfType<NotFoundObjectResult>();
            var notFoundResult = result.Result as NotFoundObjectResult;
            notFoundResult?.Value.Should().Be("Product not found");
        }

        [Fact(DisplayName = "AddToCart_WithZeroQuantity_StillAddsToCart")]
        public async Task AddToCart_WithZeroQuantity_StillAddsToCart()
        {
            // ARRANGE
            var context = CreateTestContext();
            var product = new Product 
            { 
                Id = 1, 
                Title = "Test Widget", 
                Price = 29.99m,
                Description = "A test widget",
                ImageUrl = "https://example.com/widget.jpg"
            };
            context.Products.Add(product);
            await context.SaveChangesAsync();
            
            var controller = new CartController(context);
            var request = new AddToCartRequest { ProductId = 1, Quantity = 0 };
            
            // ACT
            var result = await controller.AddToCart(request);
            
            // ASSERT
            result.Should().NotBeNull();
            var okResult = result.Result as OkObjectResult;
            okResult.Should().NotBeNull();
            
            var cartItem = okResult?.Value as CartItemResponse;
            cartItem.Should().NotBeNull();
            cartItem!.Quantity.Should().Be(0); // 0 is technically added (validation happens elsewhere)
        }
    }
}
