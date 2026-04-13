using BuckeyeMarketplaceApi.Dtos.Admin;
using FluentValidation;

namespace BuckeyeMarketplaceApi.Validators
{
    public class ProductCreateRequestValidator : AbstractValidator<ProductCreateRequest>
    {
        public ProductCreateRequestValidator()
        {
            RuleFor(x => x.Title)
                .NotEmpty().WithMessage("Title is required")
                .MaximumLength(200);

            RuleFor(x => x.Description)
                .NotEmpty().WithMessage("Description is required")
                .MaximumLength(2000);

            RuleFor(x => x.Price)
                .GreaterThan(0).WithMessage("Price must be greater than 0");

            RuleFor(x => x.Category)
                .NotEmpty().WithMessage("Category is required")
                .MaximumLength(100);

            RuleFor(x => x.SellerName)
                .NotEmpty().WithMessage("SellerName is required")
                .MaximumLength(200);

            RuleFor(x => x.ImageUrl)
                .NotEmpty().WithMessage("ImageUrl is required")
                .Must(uri => Uri.TryCreate(uri, UriKind.Absolute, out _))
                .WithMessage("ImageUrl must be a valid absolute URL");

            RuleFor(x => x.Condition)
                .NotEmpty().WithMessage("Condition is required")
                .MaximumLength(100);
        }
    }
}
