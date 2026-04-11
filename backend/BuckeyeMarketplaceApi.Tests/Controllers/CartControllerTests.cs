using Xunit;
using FluentAssertions;
using Moq;
using BuckeyeMarketplaceApi.Controllers;
using BuckeyeMarketplaceApi.Data;
using BuckeyeMarketplaceApi.Models;
using BuckeyeMarketplaceApi.Dtos;
using Microsoft.EntityFrameworkCore;
using Microsoft.AspNetCore.Mvc;

namespace BuckeyeMarketplaceApi.Tests.Controllers
{
    /// <summary>
    /// Unit tests for CartController.
    /// Tests real CartController logic with InMemory database.
    /// </summary>
    public class CartControllerTests
    {
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
            
            var cartResponse = okResult!.Value as CartResponse;
            cartResponse.Should().NotBeNull();
            cartResponse!.UserId.Should().Be("default-user");
            cartResponse.Items.Should().BeEmpty();
            cartResponse.TotalItems.Should().Be(0);
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
            var createdResult = result.Result as CreatedAtActionResult;
            createdResult.Should().NotBeNull();
            createdResult!.ActionName.Should().Be(nameof(CartController.GetCart));

            var cartItem = createdResult.Value as CartItemResponse;
            cartItem.Should().NotBeNull();
            cartItem!.ProductId.Should().Be(1);
            cartItem.Quantity.Should().Be(2);
            cartItem.LineTotal.Should().Be(59.98m);
        }

        [Fact(DisplayName = "AddToCart_WithExistingProduct_IncrementsQuantity")]
        public async Task AddToCart_WithExistingProduct_IncrementsQuantity()
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

            // ASSERT - Quantity should be 2 + 3 = 5
            var createdResult = result.Result as CreatedAtActionResult;
            createdResult.Should().NotBeNull();

            var updatedItem = createdResult!.Value as CartItemResponse;
            updatedItem.Should().NotBeNull();
            updatedItem!.Quantity.Should().Be(5);
            updatedItem.LineTotal.Should().Be(149.95m);
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
            notFoundResult!.Value.Should().Be("Product not found");
        }

        [Fact(DisplayName = "UpdateCartItem_WithValidCartItem_UpdatesQuantity")]
        public async Task UpdateCartItem_WithValidCartItem_UpdatesQuantity()
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
            var cart = new Cart { UserId = "default-user" };
            var cartItem = new CartItem { Cart = cart, Product = product, ProductId = 1, Quantity = 2 };

            context.Products.Add(product);
            context.Carts.Add(cart);
            context.CartItems.Add(cartItem);
            await context.SaveChangesAsync();

            var controller = new CartController(context);
            var cartItemId = cartItem.Id;
            var request = new UpdateCartItemRequest { Quantity = 5 };

            // ACT
            var result = await controller.UpdateCartItem(cartItemId, request);

            // ASSERT - Verify the quantity was persisted to database
            var updatedInDb = await context.CartItems.FindAsync(cartItemId);
            updatedInDb.Should().NotBeNull();
            updatedInDb!.Quantity.Should().Be(5);
        }

        [Fact(DisplayName = "RemoveCartItem_WithValidCartItem_RemovesFromCart")]
        public async Task RemoveCartItem_WithValidCartItem_RemovesFromCart()
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
            var cart = new Cart { UserId = "default-user" };
            var cartItem = new CartItem { Cart = cart, Product = product, ProductId = 1, Quantity = 2 };

            context.Products.Add(product);
            context.Carts.Add(cart);
            context.CartItems.Add(cartItem);
            await context.SaveChangesAsync();

            var controller = new CartController(context);
            var cartItemId = cartItem.Id;

            // ACT
            var result = await controller.RemoveCartItem(cartItemId);

            // ASSERT
            result.Should().BeOfType<NoContentResult>();
            
            // Verify item was removed
            var remainingItems = context.CartItems.Where(i => i.Id == cartItemId).ToList();
            remainingItems.Should().BeEmpty();
        }
    }
}
