using Microsoft.AspNetCore.Identity;

namespace BuckeyeMarketplaceApi.Data
{
    /// <summary>
    /// Seeds initial roles and admin user into the database.
    /// Called during application startup via Program.cs.
    /// </summary>
    public static class DataSeeder
    {
        public static async Task SeedRolesAndAdminAsync(IServiceProvider serviceProvider)
        {
            var roleManager = serviceProvider.GetRequiredService<RoleManager<IdentityRole>>();
            var userManager = serviceProvider.GetRequiredService<UserManager<IdentityUser>>();
            var logger = serviceProvider.GetRequiredService<ILogger<MarketplaceContext>>();

            try
            {
                // Create roles if they don't exist
                if (!await roleManager.RoleExistsAsync("Admin"))
                {
                    await roleManager.CreateAsync(new IdentityRole("Admin"));
                    logger.LogInformation("Created 'Admin' role");
                }

                if (!await roleManager.RoleExistsAsync("User"))
                {
                    await roleManager.CreateAsync(new IdentityRole("User"));
                    logger.LogInformation("Created 'User' role");
                }

                // Create admin user if it doesn't exist
                var adminEmail = "admin@buckeye.local";
                var existingAdmin = await userManager.FindByEmailAsync(adminEmail);

                if (existingAdmin == null)
                {
                    var adminUser = new IdentityUser
                    {
                        Email = adminEmail,
                        UserName = "admin",
                        EmailConfirmed = true
                    };

                    // Secure password: meets all requirements (8+ chars, uppercase, digit, special char)
                    var password = "Admin@1234!";

                    var result = await userManager.CreateAsync(adminUser, password);
                    if (result.Succeeded)
                    {
                        await userManager.AddToRoleAsync(adminUser, "Admin");
                        logger.LogInformation("Created admin user: {Email}", adminEmail);
                    }
                    else
                    {
                        logger.LogError("Failed to create admin user: {Errors}",
                            string.Join(", ", result.Errors.Select(e => e.Description)));
                    }
                }
            }
            catch (Exception ex)
            {
                logger.LogError(ex, "Error seeding database with roles and admin user");
            }
        }
    }
}
