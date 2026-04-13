using System.Security.Claims;
using System.Security.Cryptography;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using BuckeyeMarketplaceApi.Data;
using BuckeyeMarketplaceApi.Dtos;
using BuckeyeMarketplaceApi.Models;

namespace BuckeyeMarketplaceApi.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    [Authorize(Policy = "User")]
    public class OrdersController : ControllerBase
    {
        private readonly MarketplaceContext _context;

        public OrdersController(MarketplaceContext context)
        {
            _context = context;
        }

        [HttpPost]
        [ProducesResponseType(typeof(OrderResponse), StatusCodes.Status200OK)]
        [ProducesResponseType(StatusCodes.Status400BadRequest)]
        [ProducesResponseType(StatusCodes.Status401Unauthorized)]
        [ProducesResponseType(StatusCodes.Status403Forbidden)]
        public async Task<ActionResult<OrderResponse>> CreateOrder([FromBody] CreateOrderRequest request)
        {
            var userId = User.FindFirst(ClaimTypes.NameIdentifier)?.Value;
            if (userId is null)
            {
                return Unauthorized();
            }

            if (!ModelState.IsValid)
            {
                return ValidationProblem(ModelState);
            }

            if (string.IsNullOrWhiteSpace(request.ShippingAddress))
            {
                return BadRequest("Shipping address is required");
            }

            var cart = await _context.Carts
                .Include(c => c.Items)
                .ThenInclude(i => i.Product)
                .FirstOrDefaultAsync(c => c.UserId == userId);

            if (cart == null || !cart.Items.Any())
            {
                return BadRequest("Cart is empty");
            }

            var orderItems = cart.Items.Select(i => new OrderItem
            {
                ProductId = i.ProductId,
                Quantity = i.Quantity,
                UnitPrice = i.Product!.Price
            }).ToList();

            var total = orderItems.Sum(i => i.Quantity * i.UnitPrice);
            var confirmationNumber = await GenerateConfirmationNumberAsync();

            var order = new Order
            {
                UserId = userId,
                OrderDate = DateTime.UtcNow,
                Status = "Pending",
                ShippingAddress = request.ShippingAddress,
                ConfirmationNumber = confirmationNumber,
                Total = total,
                Items = orderItems
            };

            _context.Orders.Add(order);

            // Clear cart after successful order creation.
            _context.CartItems.RemoveRange(cart.Items);
            cart.UpdatedAt = DateTime.UtcNow;

            await _context.SaveChangesAsync();

            return Ok(MapOrderResponse(order));
        }

        [HttpGet("mine")]
        [ProducesResponseType(typeof(List<OrderResponse>), StatusCodes.Status200OK)]
        [ProducesResponseType(StatusCodes.Status401Unauthorized)]
        [ProducesResponseType(StatusCodes.Status403Forbidden)]
        public async Task<ActionResult<List<OrderResponse>>> GetMyOrders()
        {
            var userId = User.FindFirst(ClaimTypes.NameIdentifier)?.Value;
            if (userId is null)
            {
                return Unauthorized();
            }

            var orders = await _context.Orders
                .Where(o => o.UserId == userId)
                .Include(o => o.Items)
                .OrderByDescending(o => o.OrderDate)
                .ToListAsync();

            var response = orders.Select(MapOrderResponse).ToList();
            return Ok(response);
        }

        private async Task<string> GenerateConfirmationNumberAsync()
        {
            const string chars = "ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789";

            while (true)
            {
                var bytes = new byte[10];
                RandomNumberGenerator.Fill(bytes);

                var code = new string(bytes
                    .Select(b => chars[b % chars.Length])
                    .ToArray());

                var exists = await _context.Orders.AnyAsync(o => o.ConfirmationNumber == code);
                if (!exists)
                {
                    return code;
                }
            }
        }

        private static OrderResponse MapOrderResponse(Order order)
        {
            return new OrderResponse
            {
                OrderId = order.Id,
                OrderDate = order.OrderDate,
                Status = order.Status,
                Total = order.Total,
                ShippingAddress = order.ShippingAddress,
                ConfirmationNumber = order.ConfirmationNumber,
                Items = order.Items.Select(i => new OrderItemResponse
                {
                    ProductId = i.ProductId,
                    Quantity = i.Quantity,
                    UnitPrice = i.UnitPrice
                }).ToList()
            };
        }
    }
}
