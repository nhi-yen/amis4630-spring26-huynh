using System.IdentityModel.Tokens.Jwt;
using System.Security.Claims;
using System.Text;
using Microsoft.IdentityModel.Tokens;
using Microsoft.AspNetCore.Identity;

namespace BuckeyeMarketplaceApi.Services
{
    /// <summary>
    /// Service for generating and validating JWT tokens.
    /// JWT key is read from configuration (stored in user-secrets, never in appsettings.json).
    /// </summary>
    public interface IAuthService
    {
        Task<string> GenerateTokenAsync(IdentityUser user, IList<string> roles);
    }

    public class AuthService : IAuthService
    {
        private readonly IConfiguration _configuration;
        private readonly ILogger<AuthService> _logger;

        public AuthService(IConfiguration configuration, ILogger<AuthService> logger)
        {
            _configuration = configuration;
            _logger = logger;
        }

        /// <summary>
        /// Generates a JWT access token for the user.
        /// Token includes: sub (user ID), email, role, and exp (60 minutes from now).
        /// </summary>
        public async Task<string> GenerateTokenAsync(IdentityUser user, IList<string> roles)
        {
            try
            {
                var jwtKey = _configuration["Jwt:Key"];
                if (string.IsNullOrEmpty(jwtKey))
                {
                    throw new InvalidOperationException("JWT Key is not configured. Use: dotnet user-secrets set Jwt:Key <your-key>");
                }

                var key = new SymmetricSecurityKey(Encoding.UTF8.GetBytes(jwtKey));
                var credentials = new SigningCredentials(key, SecurityAlgorithms.HmacSha256);

                var claims = new List<Claim>
                {
                    new Claim(JwtRegisteredClaimNames.Sub, user.Id),
                    new Claim(JwtRegisteredClaimNames.Email, user.Email ?? string.Empty),
                    new Claim(ClaimTypes.NameIdentifier, user.Id)
                };

                // Add role claims
                foreach (var role in roles)
                {
                    claims.Add(new Claim(ClaimTypes.Role, role));
                }

                var token = new JwtSecurityToken(
                    issuer: "BuckeyeMarketplace",
                    audience: "BuckeyeMarketplaceApi",
                    claims: claims,
                    expires: DateTime.UtcNow.AddMinutes(60),
                    signingCredentials: credentials
                );

                return new JwtSecurityTokenHandler().WriteToken(token);
            }
            catch (Exception ex)
            {
                _logger.LogError("Error generating JWT token: {Message}", ex.Message);
                throw;
            }
        }
    }
}
