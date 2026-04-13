namespace BuckeyeMarketplaceApi.Dtos
{
    /// <summary>
    /// Request to register a new user.
    /// Email must be unique. Password must meet security requirements:
    /// - Minimum 8 characters
    /// - At least one uppercase letter
    /// - At least one digit
    /// </summary>
    public class RegisterRequest
    {
        public string Email { get; set; } = string.Empty;
        public string Password { get; set; } = string.Empty;
        public string ConfirmPassword { get; set; } = string.Empty;
    }
}
