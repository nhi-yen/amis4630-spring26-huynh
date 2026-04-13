using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Mvc;
using BuckeyeMarketplaceApi.Dtos;
using BuckeyeMarketplaceApi.Services;

namespace BuckeyeMarketplaceApi.Controllers
{
    /// <summary>
    /// Handles user authentication: registration, login, token generation.
    /// All passwords are hashed using ASP.NET Core Identity's PasswordHasher.
    /// JWT tokens expire after 60 minutes.
    /// </summary>
    [ApiController]
    [Route("api/[controller]")]
    public class AuthController : ControllerBase
    {
        private readonly UserManager<IdentityUser> _userManager;
        private readonly SignInManager<IdentityUser> _signInManager;
        private readonly IAuthService _authService;
        private readonly ILogger<AuthController> _logger;

        public AuthController(
            UserManager<IdentityUser> userManager,
            SignInManager<IdentityUser> signInManager,
            IAuthService authService,
            ILogger<AuthController> logger)
        {
            _userManager = userManager;
            _signInManager = signInManager;
            _authService = authService;
            _logger = logger;
        }

        /// <summary>
        /// Register a new user.
        /// Password must be at least 8 characters with 1 uppercase, 1 digit, 1 special character.
        /// </summary>
        [HttpPost("register")]
        [ProducesResponseType(StatusCodes.Status201Created)]
        [ProducesResponseType(StatusCodes.Status400BadRequest)]
        public async Task<IActionResult> Register([FromBody] RegisterRequest request)
        {
            if (!ModelState.IsValid)
            {
                return BadRequest(ModelState);
            }

            try
            {
                // Check if user already exists
                var existingUser = await _userManager.FindByEmailAsync(request.Email);
                if (existingUser != null)
                {
                    var problemDetails = new ProblemDetails
                    {
                        Type = "https://api.example.com/probs/duplicate-email",
                        Title = "Email already registered",
                        Status = StatusCodes.Status400BadRequest,
                        Detail = $"An account with the email '{request.Email}' already exists."
                    };
                    return BadRequest(problemDetails);
                }

                // Create new user
                var user = new IdentityUser
                {
                    Email = request.Email,
                    UserName = request.Email, // Use email as username
                    EmailConfirmed = true
                };

                var result = await _userManager.CreateAsync(user, request.Password);
                if (!result.Succeeded)
                {
                    var errors = string.Join("; ", result.Errors.Select(e => e.Description));
                    var problemDetails = new ProblemDetails
                    {
                        Type = "https://api.example.com/probs/registration-failed",
                        Title = "Registration failed",
                        Status = StatusCodes.Status400BadRequest,
                        Detail = errors
                    };
                    return BadRequest(problemDetails);
                }

                // Add user to "User" role by default
                await _userManager.AddToRoleAsync(user, "User");
                _logger.LogInformation("User registered: {Email}", request.Email);

                return StatusCode(StatusCodes.Status201Created, new
                {
                    message = "Registration successful. Please log in.",
                    email = request.Email
                });
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error during registration for email: {Email}", request.Email);
                var problemDetails = new ProblemDetails
                {
                    Type = "https://api.example.com/probs/internal-error",
                    Title = "Internal server error",
                    Status = StatusCodes.Status500InternalServerError,
                    Detail = "An error occurred during registration. Please try again later."
                };
                return StatusCode(StatusCodes.Status500InternalServerError, problemDetails);
            }
        }

        /// <summary>
        /// Authenticate user and return JWT access token.
        /// Token is valid for 60 minutes and includes user ID, email, and roles.
        /// </summary>
        [HttpPost("login")]
        [ProducesResponseType(StatusCodes.Status200OK)]
        [ProducesResponseType(StatusCodes.Status401Unauthorized)]
        public async Task<IActionResult> Login([FromBody] LoginRequest request)
        {
            if (!ModelState.IsValid)
            {
                return BadRequest(ModelState);
            }

            try
            {
                // Find user by email
                var user = await _userManager.FindByEmailAsync(request.Email);
                if (user == null)
                {
                    _logger.LogWarning("Login attempt with non-existent email: {Email}", request.Email);
                    var problemDetails = new ProblemDetails
                    {
                        Type = "https://api.example.com/probs/invalid-credentials",
                        Title = "Invalid email or password",
                        Status = StatusCodes.Status401Unauthorized,
                        Detail = "The provided email or password is incorrect."
                    };
                    return Unauthorized(problemDetails);
                }

                // Verify password (uses Identity's password hasher)
                var passwordValid = await _userManager.CheckPasswordAsync(user, request.Password);
                if (!passwordValid)
                {
                    _logger.LogWarning("Failed login attempt for user: {Email}", request.Email);
                    var problemDetails = new ProblemDetails
                    {
                        Type = "https://api.example.com/probs/invalid-credentials",
                        Title = "Invalid email or password",
                        Status = StatusCodes.Status401Unauthorized,
                        Detail = "The provided email or password is incorrect."
                    };
                    return Unauthorized(problemDetails);
                }

                // Get user roles
                var roles = await _userManager.GetRolesAsync(user);

                // Generate JWT token
                var token = await _authService.GenerateTokenAsync(user, roles);

                _logger.LogInformation("User logged in: {Email}", request.Email);

                var response = new AuthResponse
                {
                    AccessToken = token,
                    Email = user.Email ?? string.Empty,
                    UserId = user.Id,
                    Roles = roles.ToList()
                };

                return Ok(response);
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error during login for email: {Email}", request.Email);
                var problemDetails = new ProblemDetails
                {
                    Type = "https://api.example.com/probs/internal-error",
                    Title = "Internal server error",
                    Status = StatusCodes.Status500InternalServerError,
                    Detail = "An error occurred during login. Please try again later."
                };
                return StatusCode(StatusCodes.Status500InternalServerError, problemDetails);
            }
        }
    }
}
