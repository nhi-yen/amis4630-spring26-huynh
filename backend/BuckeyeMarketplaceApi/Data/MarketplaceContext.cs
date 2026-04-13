using Microsoft.EntityFrameworkCore;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Identity.EntityFrameworkCore;
using BuckeyeMarketplaceApi.Models;

namespace BuckeyeMarketplaceApi.Data
{
    public class MarketplaceContext : IdentityDbContext<IdentityUser, IdentityRole, string>
    {
        public MarketplaceContext(DbContextOptions<MarketplaceContext> options)
            : base(options)
        {
        }

        public DbSet<Product> Products { get; set; }
        public DbSet<Cart> Carts { get; set; }
        public DbSet<CartItem> CartItems { get; set; }
        public DbSet<Order> Orders { get; set; }
        public DbSet<OrderItem> OrderItems { get; set; }

        protected override void OnModelCreating(ModelBuilder modelBuilder)
        {
            base.OnModelCreating(modelBuilder);

            // Seed data for products
            modelBuilder.Entity<Product>().HasData(
                new Product
                {
                    Id = 1,
                    Title = "MacBook Air",
                    Description = "M1 chip, 13-inch display, 256GB SSD, 8GB RAM. Lightweight and fast—perfect for note-taking, coding, and campus work. Battery still lasts all day.",
                    Price = 899.99m,
                    Category = "Electronics",
                    SellerName = "John Doe",
                    PostedDate = DateTime.Now.AddDays(-2),
                    ImageUrl = "https://images.pexels.com/photos/3693732/pexels-photo-3693732.jpeg",
                    Condition = "Excellent"
                },
                new Product
                {
                    Id = 2,
                    Title = "Ergonomic Desk Chair",
                    Description = "Adjustable height, lumbar support, breathable mesh back. Great for long study sessions or gaming.",
                    Price = 129.99m,
                    Category = "Furniture",
                    SellerName = "Sarah Lee",
                    PostedDate = DateTime.Now.AddDays(-5),
                    ImageUrl = "https://images.pexels.com/photos/7195522/pexels-photo-7195522.jpeg",
                    Condition = "Very Good"
                },
                new Product
                {
                    Id = 3,
                    Title = "Business Systems Textbook",
                    Description = "BUSMGT 3230 – Business Systems & Analytics (9th Edition). Light highlighting, no torn pages. Required for OSU course.",
                    Price = 59.99m,
                    Category = "Textbooks",
                    SellerName = "Alex Kim",
                    PostedDate = DateTime.Now.AddDays(-1),
                    ImageUrl = "https://images.pexels.com/photos/7821582/pexels-photo-7821582.jpeg",
                    Condition = "Good"
                },
                new Product
                {
                    Id = 4,
                    Title = "27-inch Monitor",
                    Description = "Dell Full HD 1080p display. Great for dual-monitor setups, coding, spreadsheets, and gaming. No dead pixels.",
                    Price = 199.99m,
                    Category = "Electronics",
                    SellerName = "Emily Chen",
                    PostedDate = DateTime.Now.AddDays(-7),
                    ImageUrl = "https://images.pexels.com/photos/6045232/pexels-photo-6045232.jpeg",
                    Condition = "Very Good"
                },
                new Product
                {
                    Id = 5,
                    Title = "OSU Fleece Hoodie",
                    Description = "Official Ohio State University hoodie, unisex medium. Warm, soft, and perfect for chilly campus walks.",
                    Price = 39.99m,
                    Category = "Clothing",
                    SellerName = "Mike Brown",
                    PostedDate = DateTime.Now.AddDays(-3),
                    ImageUrl = "https://images.pexels.com/photos/6311719/pexels-photo-6311719.jpeg",
                    Condition = "Like New"
                },
                new Product
                {
                    Id = 6,
                    Title = "Wooden Coffee Table",
                    Description = "Modern oak finish with lower storage shelf. Fits well in dorms or small apartments. Minor surface wear.",
                    Price = 89.99m,
                    Category = "Furniture",
                    SellerName = "Anna Smith",
                    PostedDate = DateTime.Now.AddDays(-10),
                    ImageUrl = "https://images.pexels.com/photos/2092058/pexels-photo-2092058.jpeg",
                    Condition = "Good"
                },
                new Product
                {
                    Id = 7,
                    Title = "Noise-Cancelling Headphones",
                    Description = "Sony WH‑CH720N wireless headphones with active noise cancellation. Lightweight and great for studying.",
                    Price = 149.99m,
                    Category = "Electronics",
                    SellerName = "Chris Johnson",
                    PostedDate = DateTime.Now.AddDays(-4),
                    ImageUrl = "https://images.pexels.com/photos/815494/pexels-photo-815494.jpeg",
                    Condition = "Excellent"
                },
                new Product
                {
                    Id = 8,
                    Title = "Waterproof Backpack",
                    Description = "North Face Borealis backpack with padded laptop sleeve. Durable and weather-resistant—great for campus and travel.",
                    Price = 49.99m,
                    Category = "Clothing",
                    SellerName = "Taylor Davis",
                    PostedDate = DateTime.Now.AddDays(-6),
                    ImageUrl = "https://images.pexels.com/photos/346805/pexels-photo-346805.jpeg",
                    Condition = "Very Good"
                }
            );
        }
    }
}