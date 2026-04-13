using BuckeyeMarketplaceApi.Data;
using BuckeyeMarketplaceApi.Dtos.Admin;
using BuckeyeMarketplaceApi.Models;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

namespace BuckeyeMarketplaceApi.Controllers
{
    [ApiController]
    [Route("api/admin/orders")]
    [Authorize(Roles = "Admin")]
    public class AdminOrdersController : ControllerBase
    {
        private readonly MarketplaceContext _context;

        public AdminOrdersController(MarketplaceContext context)
        {
            _context = context;
        }

        [HttpGet]
        [ProducesResponseType(typeof(IEnumerable<AdminOrderDto>), StatusCodes.Status200OK)]
        public async Task<ActionResult<IEnumerable<AdminOrderDto>>> Get()
        {
            var orders = await _context.Orders
                .AsNoTracking()
                .Select(o => new AdminOrderDto
                {
                    Id = o.Id,
                    ConfirmationNumber = o.ConfirmationNumber,
                    Total = o.Total,
                    CreatedDate = o.OrderDate,
                    Status = o.Status,
                    Items = o.Items
                        .Select(i => new AdminOrderItemDto
                        {
                            ProductId = i.ProductId,
                            Quantity = i.Quantity,
                            UnitPrice = i.UnitPrice
                        })
                        .ToList()
                })
                    .OrderByDescending(o => o.CreatedDate)
                .ToListAsync();

            return Ok(orders);
        }

        [HttpPut("{orderId:int}/status")]
        [ProducesResponseType(typeof(AdminOrderDto), StatusCodes.Status200OK)]
        [ProducesResponseType(typeof(ValidationProblemDetails), StatusCodes.Status400BadRequest)]
        [ProducesResponseType(typeof(ProblemDetails), StatusCodes.Status404NotFound)]
        public async Task<ActionResult<AdminOrderDto>> UpdateStatus(int orderId, [FromBody] OrderStatusUpdateRequest request)
        {
            if (!ModelState.IsValid)
            {
                return ValidationProblem(ModelState);
            }

            var order = await _context.Orders
                .Include(o => o.Items)
                .FirstOrDefaultAsync(o => o.Id == orderId);

            if (order is null)
            {
                return NotFound(new ProblemDetails
                {
                    Title = "Order not found",
                    Detail = $"No order exists with id {orderId}.",
                    Status = StatusCodes.Status404NotFound
                });
            }

            order.Status = request.Status;
            await _context.SaveChangesAsync();

            var response = new AdminOrderDto
            {
                Id = order.Id,
                ConfirmationNumber = order.ConfirmationNumber,
                Total = order.Total,
                CreatedDate = order.OrderDate,
                Status = order.Status,
                Items = order.Items
                    .Select(i => new AdminOrderItemDto
                    {
                        ProductId = i.ProductId,
                        Quantity = i.Quantity,
                        UnitPrice = i.UnitPrice
                    })
                    .ToList()
            };

            return Ok(response);
        }
    }
}
