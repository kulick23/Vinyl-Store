using BLL.DTO;

public record CheckoutDto(
    IReadOnlyList<CheckoutItemDto> Items);