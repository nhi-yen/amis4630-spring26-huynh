using System.ComponentModel.DataAnnotations;

namespace BuckeyeMarketplaceApi.Models
{
    public class Order
    {
        [Key]
        public int Id { get; set; }

        [Required]
        public string UserId { get; set; } = string.Empty;

        public DateTime OrderDate { get; set; }

        [Required]
        public string Status { get; set; } = string.Empty;

        public decimal Total { get; set; }

        [Required]
        public string ShippingAddress { get; set; } = string.Empty;

        [Required]
        public string ConfirmationNumber { get; set; } = string.Empty;

        public ICollection<OrderItem> Items { get; set; } = new List<OrderItem>();
    }
}
