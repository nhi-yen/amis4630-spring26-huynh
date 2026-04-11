using Xunit;
using FluentAssertions;
using FluentValidation;
using BuckeyeMarketplaceApi.Dtos;
using BuckeyeMarketplaceApi.Validators;

namespace BuckeyeMarketplaceApi.Tests.Validators
{
    /// <summary>
    /// Unit tests for AddToCartRequestValidator.
    /// Tests validation rules for cart requests.
    /// </summary>
    public class AddToCartRequestValidatorTests
    {
        private readonly AddToCartRequestValidator _validator = new();

        [Fact(DisplayName = "Validate_WithValidInput_Succeeds")]
        public void Validate_WithValidInput_Succeeds()
        {
            // ARRANGE
            var request = new AddToCartRequest { ProductId = 1, Quantity = 5 };

            // ACT
            var result = _validator.Validate(request);

            // ASSERT
            result.IsValid.Should().BeTrue();
            result.Errors.Should().BeEmpty();
        }

        [Fact(DisplayName = "Validate_WithProductIdZero_Fails")]
        public void Validate_WithProductIdZero_Fails()
        {
            // ARRANGE
            var request = new AddToCartRequest { ProductId = 0, Quantity = 1 };

            // ACT
            var result = _validator.Validate(request);

            // ASSERT
            result.IsValid.Should().BeFalse();
            result.Errors.Should().Contain(e => e.PropertyName == "ProductId");
            result.Errors.First().ErrorMessage.Should().Contain("greater than 0");
        }

        [Fact(DisplayName = "Validate_WithNegativeProductId_Fails")]
        public void Validate_WithNegativeProductId_Fails()
        {
            // ARRANGE
            var request = new AddToCartRequest { ProductId = -5, Quantity = 1 };

            // ACT
            var result = _validator.Validate(request);

            // ASSERT
            result.IsValid.Should().BeFalse();
            result.Errors.Should().Contain(e => e.PropertyName == "ProductId");
        }

        [Fact(DisplayName = "Validate_WithQuantityZero_Fails")]
        public void Validate_WithQuantityZero_Fails()
        {
            // ARRANGE
            var request = new AddToCartRequest { ProductId = 1, Quantity = 0 };

            // ACT
            var result = _validator.Validate(request);

            // ASSERT
            result.IsValid.Should().BeFalse();
            result.Errors.Should().Contain(e => e.PropertyName == "Quantity");
            result.Errors.First().ErrorMessage.Should().Contain("between 1 and 99");
        }

        [Fact(DisplayName = "Validate_WithQuantityAboveLimit_Fails")]
        public void Validate_WithQuantityAboveLimit_Fails()
        {
            // ARRANGE
            var request = new AddToCartRequest { ProductId = 1, Quantity = 100 };

            // ACT
            var result = _validator.Validate(request);

            // ASSERT
            result.IsValid.Should().BeFalse();
            result.Errors.Should().Contain(e => e.PropertyName == "Quantity");
            result.Errors.First().ErrorMessage.Should().Contain("between 1 and 99");
        }

        [Fact(DisplayName = "Validate_WithQuantityAtMinBoundary_Succeeds")]
        public void Validate_WithQuantityAtMinBoundary_Succeeds()
        {
            // ARRANGE
            var request = new AddToCartRequest { ProductId = 1, Quantity = 1 };

            // ACT
            var result = _validator.Validate(request);

            // ASSERT
            result.IsValid.Should().BeTrue();
        }

        [Fact(DisplayName = "Validate_WithQuantityAtMaxBoundary_Succeeds")]
        public void Validate_WithQuantityAtMaxBoundary_Succeeds()
        {
            // ARRANGE
            var request = new AddToCartRequest { ProductId = 1, Quantity = 99 };

            // ACT
            var result = _validator.Validate(request);

            // ASSERT
            result.IsValid.Should().BeTrue();
        }
    }
}
