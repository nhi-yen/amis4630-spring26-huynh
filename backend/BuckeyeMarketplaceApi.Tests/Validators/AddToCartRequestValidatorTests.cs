using BuckeyeMarketplaceApi.Dtos;
using BuckeyeMarketplaceApi.Validators;
using FluentAssertions;
using Xunit;

namespace BuckeyeMarketplaceApi.Tests.Validators
{
    public class AddToCartRequestValidatorTests
    {
        private readonly AddToCartRequestValidator _validator = new();

        [Fact(DisplayName = "Validate_WithInvalidProductId_FailsValidation")]
        public void Validate_WithInvalidProductId_FailsValidation()
        {
            // Arrange
            var request = new AddToCartRequest
            {
                ProductId = 0,
                Quantity = 1
            };

            // Act
            var result = _validator.Validate(request);

            // Assert
            result.IsValid.Should().BeFalse();
            result.Errors.Should().ContainSingle(e => e.PropertyName == nameof(AddToCartRequest.ProductId));
            result.Errors.Should().Contain(e => e.ErrorMessage == "ProductId must be greater than 0");
        }

        [Fact(DisplayName = "Validate_WithInvalidQuantity_FailsValidation")]
        public void Validate_WithInvalidQuantity_FailsValidation()
        {
            // Arrange
            var request = new AddToCartRequest
            {
                ProductId = 1,
                Quantity = 100
            };

            // Act
            var result = _validator.Validate(request);

            // Assert
            result.IsValid.Should().BeFalse();
            result.Errors.Should().ContainSingle(e => e.PropertyName == nameof(AddToCartRequest.Quantity));
            result.Errors.Should().Contain(e => e.ErrorMessage == "Quantity must be between 1 and 99");
        }

        [Fact(DisplayName = "Validate_WithBoundaryValues_Succeeds")]
        public void Validate_WithBoundaryValues_Succeeds()
        {
            // Arrange
            var minBoundary = new AddToCartRequest { ProductId = 1, Quantity = 1 };
            var maxBoundary = new AddToCartRequest { ProductId = 1, Quantity = 99 };

            // Act
            var minResult = _validator.Validate(minBoundary);
            var maxResult = _validator.Validate(maxBoundary);

            // Assert
            minResult.IsValid.Should().BeTrue();
            minResult.Errors.Should().BeEmpty();

            maxResult.IsValid.Should().BeTrue();
            maxResult.Errors.Should().BeEmpty();
        }

        [Fact(DisplayName = "Validate_WithValidRequest_Succeeds")]
        public void Validate_WithValidRequest_Succeeds()
        {
            // Arrange
            var request = new AddToCartRequest
            {
                ProductId = 5,
                Quantity = 3
            };

            // Act
            var result = _validator.Validate(request);

            // Assert
            result.IsValid.Should().BeTrue();
            result.Errors.Should().BeEmpty();
        }
    }
}
