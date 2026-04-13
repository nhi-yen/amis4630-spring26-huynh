namespace BuckeyeMarketplaceApi.Dtos
{
    /// <summary>
    /// Response returned on successful login.
    /// Contains JWT access token and user information.
    /// </summary>
    public class AuthResponse
    {
        public string AccessToken { get; set; } = string.Empty;
        public string Email { get; set; } = string.Empty;
        public string UserId { get; set; } = string.Empty;
        public List<string> Roles { get; set; } = new();
    }
}
