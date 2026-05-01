using BuckeyeMarketplaceApi.Data;
using BuckeyeMarketplaceApi.Services;
using Microsoft.AspNetCore.Authentication.JwtBearer;
using Microsoft.AspNetCore.Identity;
using Microsoft.EntityFrameworkCore;
using Microsoft.IdentityModel.Tokens;
using FluentValidation;
using FluentValidation.AspNetCore;
using System.Text;

var builder = WebApplication.CreateBuilder(args);

// Add services to the container
builder.Services.AddControllers();
builder.Services.AddEndpointsApiExplorer();
builder.Services.AddSwaggerGen();

builder.Services.AddValidatorsFromAssemblyContaining<Program>();
builder.Services.AddFluentValidationAutoValidation();
builder.Services.AddFluentValidationClientsideAdapters();

var connectionString = builder.Configuration.GetConnectionString("DefaultConnection");
if (string.IsNullOrWhiteSpace(connectionString))
{
    throw new InvalidOperationException(
        "DefaultConnection is not configured. Set ConnectionStrings__DefaultConnection in your environment.");
}

builder.Services.AddDbContext<MarketplaceContext>(options =>
    options.UseSqlServer(connectionString));

// ⭐ Add ASP.NET Core Identity with password requirements
builder.Services.AddIdentity<IdentityUser, IdentityRole>(options =>
{
    // Password requirements: min 8 chars, 1 uppercase, 1 digit, 1 special char
    options.Password.RequiredLength = 8;
    options.Password.RequireDigit = true;
    options.Password.RequireUppercase = true;
    options.Password.RequireLowercase = false;
    options.Password.RequireNonAlphanumeric = true;
    options.Password.RequiredUniqueChars = 1;
    
    // Lockout settings (after 5 failed attempts, lock for 15 minutes)
    options.Lockout.MaxFailedAccessAttempts = 5;
    options.Lockout.DefaultLockoutTimeSpan = TimeSpan.FromMinutes(15);
    options.Lockout.AllowedForNewUsers = true;
    
    // User settings
    options.User.RequireUniqueEmail = true;
})
.AddEntityFrameworkStores<MarketplaceContext>()
.AddDefaultTokenProviders();

// ⭐ Add JWT Bearer authentication
var jwtKey = builder.Configuration["Jwt:Key"];
if (string.IsNullOrEmpty(jwtKey))
{
    throw new InvalidOperationException(
        "JWT Key is not configured. Please run: dotnet user-secrets set Jwt:Key <your-secret-key>");
}

var jwtIssuer = builder.Configuration["Jwt:Issuer"] ?? "BuckeyeMarketplace";
var jwtAudience = builder.Configuration["Jwt:Audience"] ?? "BuckeyeMarketplaceApi";

var key = Encoding.ASCII.GetBytes(jwtKey);
builder.Services.AddAuthentication(options =>
{
    options.DefaultAuthenticateScheme = JwtBearerDefaults.AuthenticationScheme;
    options.DefaultChallengeScheme = JwtBearerDefaults.AuthenticationScheme;
})
.AddJwtBearer(options =>
{
    options.TokenValidationParameters = new TokenValidationParameters
    {
        ValidateIssuerSigningKey = true,
        IssuerSigningKey = new SymmetricSecurityKey(key),
        ValidateIssuer = true,
        ValidIssuer = jwtIssuer,
        ValidateAudience = true,
        ValidAudience = jwtAudience,
        ValidateLifetime = true,
        ClockSkew = TimeSpan.Zero
    };
});

// ⭐ Add Authorization with role-based policies
builder.Services.AddAuthorization(options =>
{
    options.AddPolicy("Admin", policy => policy.RequireRole("Admin"));
    options.AddPolicy("User", policy => policy.RequireRole("User"));
});

// ⭐ Register AuthService for JWT token generation
builder.Services.AddScoped<IAuthService, AuthService>();

var allowedOrigins = builder.Configuration.GetSection("Cors:AllowedOrigins").Get<string[]>()
    ?? new[] { "http://localhost:5173" };

// ⭐ Add CORS for configured frontend origins
builder.Services.AddCors(options =>
{
    options.AddPolicy("AllowReact", policy =>
    {
        policy.WithOrigins(allowedOrigins)
              .AllowAnyHeader()
              .AllowAnyMethod();
    });
});

var app = builder.Build();

// Seed the database
using (var scope = app.Services.CreateScope())
{
    var context = scope.ServiceProvider.GetRequiredService<MarketplaceContext>();
    context.Database.EnsureCreated();
    
    // ⭐ Seed roles and admin user
    await DataSeeder.SeedRolesAndAdminAsync(scope.ServiceProvider);
}

// Configure the HTTP request pipeline
if (app.Environment.IsDevelopment())
{
    app.UseSwagger();
    app.UseSwaggerUI();
}

app.UseHttpsRedirection();

// ⭐ CORS must be before Authentication so preflight OPTIONS requests are not challenged
app.UseCors("AllowReact");

// ⭐ Authentication and Authorization middleware (order matters!)
app.UseAuthentication();
app.UseAuthorization();

app.MapControllers();

app.Run();
