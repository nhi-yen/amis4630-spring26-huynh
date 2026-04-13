using BuckeyeMarketplaceApi.Dtos.Admin;
using FluentValidation;

namespace BuckeyeMarketplaceApi.Validators
{
    public class OrderStatusUpdateRequestValidator : AbstractValidator<OrderStatusUpdateRequest>
    {
        private static readonly string[] AllowedStatuses =
        {
            "Pending",
            "Processing",
            "Shipped",
            "Delivered",
            "Cancelled"
        };

        public OrderStatusUpdateRequestValidator()
        {
            RuleFor(x => x.Status)
                .NotEmpty().WithMessage("Status is required")
                .Must(status => AllowedStatuses.Contains(status))
                .WithMessage("Status is invalid. Allowed values: Pending, Processing, Shipped, Delivered, Cancelled.");
        }
    }
}
