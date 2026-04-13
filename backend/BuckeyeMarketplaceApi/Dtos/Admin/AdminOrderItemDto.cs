namespace BuckeyeMarketplaceApi.Dtos.Admin
{
    public class AdminOrderItemDto
    {
        public int ProductId { get; set; }

        public int Quantity { get; set; }

        public decimal UnitPrice { get; set; }
    }
}
