using System.Collections.Generic;

namespace BLL.DTO
{
    public record ReleaseDetailsDto(
        ReleaseDto Release,
        IReadOnlyList<InventoryItemDto> Listings);
}
