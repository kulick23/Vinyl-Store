using System.Collections.Generic;

namespace Application.DTOs
{
    public record ReleaseDetailsDto(
        ReleaseDto Release,
        IReadOnlyList<InventoryItemDto> Listings);
}
