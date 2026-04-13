using System.ComponentModel.DataAnnotations;

namespace BuckeyeMarketplaceApi.Dtos
{
    public class CreateOrderRequest
    {
        [Required]
        public string ShippingAddress { get; set; } = string.Empty;
    }
}
