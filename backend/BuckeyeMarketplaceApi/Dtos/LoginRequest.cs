namespace BuckeyeMarketplaceApi.Dtos
{
    /// <summary>
    /// Request to authenticate a user and obtain JWT tokens.
    /// </summary>
    public class LoginRequest
    {
        public string Email { get; set; } = string.Empty;
        public string Password { get; set; } = string.Empty;
    }
}
