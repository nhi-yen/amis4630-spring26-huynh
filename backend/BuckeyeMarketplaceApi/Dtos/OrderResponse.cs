namespace BuckeyeMarketplaceApi.Dtos
{
    public class OrderResponse
    {
        public int OrderId { get; set; }
        public DateTime OrderDate { get; set; }
        public string Status { get; set; } = string.Empty;
        public decimal Total { get; set; }
        public string ShippingAddress { get; set; } = string.Empty;
        public string ConfirmationNumber { get; set; } = string.Empty;
        public List<OrderItemResponse> Items { get; set; } = new();
    }
}
