namespace BuckeyeMarketplaceApi.Dtos.Admin
{
    public class AdminOrderDto
    {
        public int Id { get; set; }

        public string ConfirmationNumber { get; set; } = string.Empty;

        public decimal Total { get; set; }

        public DateTime CreatedDate { get; set; }

        public string Status { get; set; } = string.Empty;

        public ICollection<AdminOrderItemDto> Items { get; set; } = new List<AdminOrderItemDto>();
    }
}
