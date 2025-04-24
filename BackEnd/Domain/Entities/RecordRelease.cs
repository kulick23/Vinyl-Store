using System.Collections.Generic;

namespace Domain.Entities
{
    public class RecordRelease : BaseEntity
    {
        public string Title { get; set; } = string.Empty;
        public int Year { get; set; }
        public int ArtistId { get; set; }
        public int GenreId { get; set; }

        public Artist Artist { get; set; }
        public Genre Genre { get; set; }
        public ICollection<InventoryItem> Listings { get; set; } = new List<InventoryItem>();
    }
}
