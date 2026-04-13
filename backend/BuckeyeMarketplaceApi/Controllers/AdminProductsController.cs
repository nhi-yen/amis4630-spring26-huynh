using BuckeyeMarketplaceApi.Data;
using BuckeyeMarketplaceApi.Dtos.Admin;
using BuckeyeMarketplaceApi.Models;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

namespace BuckeyeMarketplaceApi.Controllers
{
    [ApiController]
    [Route("api/admin/products")]
    [Authorize(Roles = "Admin")]
    public class AdminProductsController : ControllerBase
    {
        private readonly MarketplaceContext _context;

        public AdminProductsController(MarketplaceContext context)
        {
            _context = context;
        }

        [HttpGet]
        [ProducesResponseType(typeof(IEnumerable<Product>), StatusCodes.Status200OK)]
        public async Task<ActionResult<IEnumerable<Product>>> Get()
        {
            var products = await _context.Products
                .OrderBy(p => p.Id)
                .ToListAsync();

            return Ok(products);
        }

        [HttpPost]
        [ProducesResponseType(typeof(Product), StatusCodes.Status201Created)]
        [ProducesResponseType(typeof(ValidationProblemDetails), StatusCodes.Status400BadRequest)]
        public async Task<ActionResult<Product>> Create([FromBody] ProductCreateRequest request)
        {
            if (!ModelState.IsValid)
            {
                return ValidationProblem(ModelState);
            }

            var product = new Product
            {
                Title = request.Title,
                Description = request.Description,
                Price = request.Price,
                Category = request.Category,
                SellerName = request.SellerName,
                ImageUrl = request.ImageUrl,
                Condition = request.Condition,
                PostedDate = DateTime.UtcNow
            };

            _context.Products.Add(product);
            await _context.SaveChangesAsync();

            return CreatedAtAction(nameof(Get), new { id = product.Id }, product);
        }

        [HttpPut("{id:int}")]
        [ProducesResponseType(typeof(Product), StatusCodes.Status200OK)]
        [ProducesResponseType(typeof(ValidationProblemDetails), StatusCodes.Status400BadRequest)]
        [ProducesResponseType(typeof(ProblemDetails), StatusCodes.Status404NotFound)]
        public async Task<ActionResult<Product>> Update(int id, [FromBody] ProductUpdateRequest request)
        {
            if (!ModelState.IsValid)
            {
                return ValidationProblem(ModelState);
            }

            var product = await _context.Products.FirstOrDefaultAsync(p => p.Id == id);
            if (product is null)
            {
                return NotFound(new ProblemDetails
                {
                    Title = "Product not found",
                    Detail = $"No product exists with id {id}.",
                    Status = StatusCodes.Status404NotFound
                });
            }

            product.Title = request.Title;
            product.Description = request.Description;
            product.Price = request.Price;
            product.Category = request.Category;
            product.SellerName = request.SellerName;
            product.ImageUrl = request.ImageUrl;
            product.Condition = request.Condition;

            await _context.SaveChangesAsync();

            return Ok(product);
        }

        [HttpDelete("{id:int}")]
        [ProducesResponseType(StatusCodes.Status204NoContent)]
        [ProducesResponseType(typeof(ProblemDetails), StatusCodes.Status404NotFound)]
        public async Task<IActionResult> Delete(int id)
        {
            var product = await _context.Products.FirstOrDefaultAsync(p => p.Id == id);
            if (product is null)
            {
                return NotFound(new ProblemDetails
                {
                    Title = "Product not found",
                    Detail = $"No product exists with id {id}.",
                    Status = StatusCodes.Status404NotFound
                });
            }

            _context.Products.Remove(product);
            await _context.SaveChangesAsync();

            return NoContent();
        }
    }
}
