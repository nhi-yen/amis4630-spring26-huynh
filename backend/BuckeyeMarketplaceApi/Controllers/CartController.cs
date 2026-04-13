using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Authorization;
using Microsoft.EntityFrameworkCore;
using System.Security.Claims;
using BuckeyeMarketplaceApi.Data;
using BuckeyeMarketplaceApi.Models;
using BuckeyeMarketplaceApi.Dtos;

namespace BuckeyeMarketplaceApi.Controllers
{
    [ApiController]
    [Route("api/cart")]
    [Authorize(Policy = "User")]
    public class CartController : ControllerBase
    {
        private readonly MarketplaceContext _context;

        public CartController(MarketplaceContext context)
        {
            _context = context;
        }

        [HttpGet]
        public async Task<ActionResult<CartResponse>> GetCart()
        {
            var userId = User.FindFirst(ClaimTypes.NameIdentifier)?.Value;
            if (userId is null) return Unauthorized();

            var cart = await _context.Carts
                .Include(c => c.Items)
                .ThenInclude(i => i.Product)
                .FirstOrDefaultAsync(c => c.UserId == userId);

            if (cart == null)
            {
                cart = new Cart { UserId = userId };
                _context.Carts.Add(cart);
                await _context.SaveChangesAsync();
            }

            var response = new CartResponse
            {
                Id = cart.Id,
                UserId = cart.UserId,
                Items = cart.Items.Select(i => new CartItemResponse
                {
                    Id = i.Id,
                    ProductId = i.ProductId,
                    ProductName = i.Product!.Title,
                    Price = i.Product!.Price,
                    ImageUrl = i.Product!.ImageUrl,
                    Quantity = i.Quantity,
                    LineTotal = i.Product!.Price * i.Quantity
                }).ToList(),
                TotalItems = cart.Items.Sum(i => i.Quantity),
                Subtotal = cart.Items.Sum(i => i.Product!.Price * i.Quantity),
                Total = cart.Items.Sum(i => i.Product!.Price * i.Quantity),
                CreatedAt = cart.CreatedAt,
                UpdatedAt = cart.UpdatedAt
            };

            return Ok(response);
        }

        [HttpPost]
        public async Task<ActionResult<CartItemResponse>> AddToCart(AddToCartRequest request)
        {
            var userId = User.FindFirst(ClaimTypes.NameIdentifier)?.Value;
            if (userId is null) return Unauthorized();

            var product = await _context.Products.FindAsync(request.ProductId);
            if (product == null)
            {
                return NotFound("Product not found");
            }

            var cart = await _context.Carts
                .Include(c => c.Items)
                .FirstOrDefaultAsync(c => c.UserId == userId);

            if (cart == null)
            {
                cart = new Cart { UserId = userId };
                _context.Carts.Add(cart);
            }

            var existingItem = cart.Items.FirstOrDefault(i => i.ProductId == request.ProductId);
            if (existingItem != null)
            {
                existingItem.Quantity += request.Quantity;
            }
            else
            {
                var newItem = new CartItem
                {
                    CartId = cart.Id,
                    ProductId = request.ProductId,
                    Quantity = request.Quantity
                };
                cart.Items.Add(newItem);
            }

            cart.UpdatedAt = DateTime.UtcNow;
            await _context.SaveChangesAsync();

            var addedItem = cart.Items.First(i => i.ProductId == request.ProductId);
            var itemResponse = new CartItemResponse
            {
                Id = addedItem.Id,
                ProductId = addedItem.ProductId,
                ProductName = product.Title,
                Price = product.Price,
                ImageUrl = product.ImageUrl,
                Quantity = addedItem.Quantity,
                LineTotal = product.Price * addedItem.Quantity
            };

            return CreatedAtAction(nameof(GetCart), itemResponse);
        }

        [HttpPut("{cartItemId}")]
        public async Task<ActionResult<CartItemResponse>> UpdateCartItem(int cartItemId, UpdateCartItemRequest request)
        {
            var userId = User.FindFirst(ClaimTypes.NameIdentifier)?.Value;
            if (userId is null) return Unauthorized();

            var cartItem = await _context.CartItems
                .Include(i => i.Product)
                .Include(i => i.Cart)
                .FirstOrDefaultAsync(i => i.Id == cartItemId);

            if (cartItem == null)
            {
                return NotFound();
            }

            if (cartItem.Cart!.UserId != userId)
            {
                return Forbid();
            }

            cartItem.Quantity = request.Quantity;
            cartItem.Cart!.UpdatedAt = DateTime.UtcNow;

            await _context.SaveChangesAsync();

            var response = new CartItemResponse
            {
                Id = cartItem.Id,
                ProductId = cartItem.ProductId,
                ProductName = cartItem.Product!.Title,
                Price = cartItem.Product!.Price,
                ImageUrl = cartItem.Product!.ImageUrl,
                Quantity = cartItem.Quantity,
                LineTotal = cartItem.Product!.Price * cartItem.Quantity
            };

            return Ok(response);
        }

        [HttpDelete("{cartItemId}")]
        public async Task<IActionResult> RemoveCartItem(int cartItemId)
        {
            var userId = User.FindFirst(ClaimTypes.NameIdentifier)?.Value;
            if (userId is null) return Unauthorized();

            var cartItem = await _context.CartItems
                .Include(i => i.Cart)
                .FirstOrDefaultAsync(i => i.Id == cartItemId);

            if (cartItem == null)
            {
                return NotFound();
            }

            if (cartItem.Cart!.UserId != userId)
            {
                return Forbid();
            }

            _context.CartItems.Remove(cartItem);
            cartItem.Cart!.UpdatedAt = DateTime.UtcNow;

            await _context.SaveChangesAsync();

            return NoContent();
        }

        [HttpDelete("clear")]
        public async Task<IActionResult> ClearCart()
        {
            var userId = User.FindFirst(ClaimTypes.NameIdentifier)?.Value;
            if (userId is null) return Unauthorized();

            var cart = await _context.Carts
                .Include(c => c.Items)
                .FirstOrDefaultAsync(c => c.UserId == userId);

            if (cart == null)
            {
                return NotFound();
            }

            _context.CartItems.RemoveRange(cart.Items);
            cart.UpdatedAt = DateTime.UtcNow;

            await _context.SaveChangesAsync();

            return NoContent();
        }
    }
}