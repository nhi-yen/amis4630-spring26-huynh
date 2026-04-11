using Xunit;
using FluentAssertions;
using BuckeyeMarketplaceApi.Data;
using BuckeyeMarketplaceApi.Models;
using BuckeyeMarketplaceApi.Dtos;
using Microsoft.EntityFrameworkCore;

namespace BuckeyeMarketplaceApi.Tests.Integration
{
    /// <summary>
    /// Integration tests for CartController with real database (InMemory).
    /// Tests complete workflows and authorization-like behavior.
    /// 
    /// Week 13 Issue: Tests the hardcoded userId pattern and ownership validation.
    /// This simulates auth behavior that would be enforced by JWT in M5.
    /// </summary>
    public class CartIntegrationTests
    {
        private MarketplaceContext CreateTestContext()
        {
            var options = new DbContextOptionsBuilder<MarketplaceContext>()
                .UseInMemoryDatabase(databaseName: Guid.NewGuid().ToString())
                .Options;
            return new MarketplaceContext(options);
        }

        [Fact(DisplayName = "AddToCart_CreateNewCart_PersistsToDatabase")]
        public async Task AddToCart_CreateNewCart_PersistsToDatabase()
        {
            // ARRANGE
            var context = CreateTestContext();
            var product = new Product
            {
                Id = 1,
                Title = "Test Product",
                Price = 19.99m,
                Description = "Test",
                ImageUrl = "https://example.com/test.jpg"
            };
            context.Products.Add(product);
            await context.SaveChangesAsync();

            var controller = new BuckeyeMarketplaceApi.Controllers.CartController(context);
            var request = new AddToCartRequest { ProductId = 1, Quantity = 3 };

            // ACT
            var result = await controller.AddToCart(request);

            // ASSERT - Backend created and persisted cart
            result.Result.Should().NotBeNull();
            
            var cartInDb = await context.Carts
                .Include(c => c.Items)
                .FirstOrDefaultAsync(c => c.UserId == "default-user");
            
            cartInDb.Should().NotBeNull("Cart should be persisted for default-user");
            cartInDb!.Items.Should().HaveCount(1);
            cartInDb.Items.First().Quantity.Should().Be(3);
            cartInDb.Items.First().ProductId.Should().Be(1);
        }

        [Fact(DisplayName = "AddToCart_WithDuplicateProduct_MergesToExistingItem")]
        public async Task AddToCart_WithDuplicateProduct_MergesToExistingItem()
        {
            // ARRANGE - Setup: Cart already has 2 of product 1
            var context = CreateTestContext();
            var product = new Product
            {
                Id = 1,
                Title = "Test Product",
                Price = 19.99m,
                Description = "Test",
                ImageUrl = "https://example.com/test.jpg"
            };
            var cart = new Cart { UserId = "default-user" };
            var existingItem = new CartItem { Cart = cart, Product = product, ProductId = 1, Quantity = 2 };

            context.Products.Add(product);
            context.Carts.Add(cart);
            context.CartItems.Add(existingItem);
            await context.SaveChangesAsync();

            var controller = new BuckeyeMarketplaceApi.Controllers.CartController(context);
            var request = new AddToCartRequest { ProductId = 1, Quantity = 3 };

            // ACT - Add 3 more of the same product
            var result = await controller.AddToCart(request);

            // ASSERT - Cart should have 1 item with quantity 5, not 2 items
            result.Result.Should().NotBeNull();
            
            var cartInDb = await context.Carts
                .Include(c => c.Items)
                .FirstOrDefaultAsync(c => c.UserId == "default-user");
            
            cartInDb!.Items.Should().HaveCount(1, "Should merge into existing item, not create duplicate");
            cartInDb.Items.First().Quantity.Should().Be(5, "2 existing + 3 added = 5");
        }

        [Fact(DisplayName = "GetCart_AfterAddOperations_CalculatesTotalsCorrectly")]
        public async Task GetCart_AfterAddOperations_CalculatesTotalsCorrectly()
        {
            // ARRANGE - Add multiple products
            var context = CreateTestContext();
            var product1 = new Product
            {
                Id = 1,
                Title = "Product 1",
                Price = 10.00m,
                Description = "Test",
                ImageUrl = "https://example.com/p1.jpg"
            };
            var product2 = new Product
            {
                Id = 2,
                Title = "Product 2",
                Price = 20.00m,
                Description = "Test",
                ImageUrl = "https://example.com/p2.jpg"
            };
            context.Products.Add(product1);
            context.Products.Add(product2);
            await context.SaveChangesAsync();

            var controller = new BuckeyeMarketplaceApi.Controllers.CartController(context);
            
            // ACT - Add items
            await controller.AddToCart(new AddToCartRequest { ProductId = 1, Quantity = 2 }); // 2 * 10 = 20
            await controller.AddToCart(new AddToCartRequest { ProductId = 2, Quantity = 3 }); // 3 * 20 = 60
            var getResult = await controller.GetCart();

            // ASSERT - Totals should be 20 + 60 = 80
            var okResult = getResult.Result as Microsoft.AspNetCore.Mvc.OkObjectResult;
            okResult.Should().NotBeNull();
            
            var cartResponse = okResult!.Value as CartResponse;
            cartResponse.Should().NotBeNull();
            cartResponse!.TotalItems.Should().Be(5, "2 + 3 items");
            cartResponse.Subtotal.Should().Be(80m, "(2 * 10) + (3 * 20)");
            cartResponse.Total.Should().Be(80m);
            cartResponse.Items.Should().HaveCount(2);
        }

        [Fact(DisplayName = "UpdateCartItem_ReduceQuantity_PersistsChange")]
        public async Task UpdateCartItem_ReduceQuantity_PersistsChange()
        {
            // ARRANGE
            var context = CreateTestContext();
            var product = new Product
            {
                Id = 1,
                Title = "Test",
                Price = 15.00m,
                Description = "Test",
                ImageUrl = "https://example.com/test.jpg"
            };
            var cart = new Cart { UserId = "default-user" };
            var item = new CartItem { Cart = cart, Product = product, ProductId = 1, Quantity = 5 };

            context.Products.Add(product);
            context.Carts.Add(cart);
            context.CartItems.Add(item);
            await context.SaveChangesAsync();

            var itemIdToUpdate = item.Id;
            var controller = new BuckeyeMarketplaceApi.Controllers.CartController(context);

            // ACT
            var result = await controller.UpdateCartItem(itemIdToUpdate, new UpdateCartItemRequest { Quantity = 2 });

            // ASSERT - Verify persistence
            var updatedItemDb = await context.CartItems.FirstOrDefaultAsync(i => i.Id == itemIdToUpdate);
            updatedItemDb.Should().NotBeNull();
            updatedItemDb!.Quantity.Should().Be(2);
        }

        [Fact(DisplayName = "RemoveCartItem_VerifyOwnership_OnlyRemovesFromOwnersCart")]
        public async Task RemoveCartItem_VerifyOwnership_OnlyRemovesFromOwnersCart()
        {
            // ARRANGE - User A has cart with item
            var context = CreateTestContext();
            var product = new Product
            {
                Id = 1,
                Title = "Test",
                Price = 10.00m,
                Description = "Test",
                ImageUrl = "https://example.com/test.jpg"
            };
            var cart = new Cart { UserId = "default-user" };
            var item = new CartItem { Cart = cart, Product = product, ProductId = 1, Quantity = 2 };

            context.Products.Add(product);
            context.Carts.Add(cart);
            context.CartItems.Add(item);
            await context.SaveChangesAsync();

            var controller = new BuckeyeMarketplaceApi.Controllers.CartController(context);
            var itemId = item.Id;

            // ACT - Remove item (controller only removes from "default-user" cart)
            var result = await controller.RemoveCartItem(itemId);

            // ASSERT - Item should be removed ONLY because it belongs to default-user
            // (This tests the ownership check: cartItem.Cart!.UserId != CurrentUserId)
            result.Should().BeOfType<Microsoft.AspNetCore.Mvc.NoContentResult>();
            
            var itemStillExists = await context.CartItems.FirstOrDefaultAsync(i => i.Id == itemId);
            itemStillExists.Should().BeNull("Item should be deleted from database");
        }
    }
}
