using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations.Schema;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Domain.Entities;

public class VinylRecord : BaseEntity
{
    public required string Title { get; set; }
    public int Year { get; set; } = 0;
    public required int ArtistId { get; set; }
    public required int GenreId { get; set; }
    [Column(TypeName = "decimal(18, 2)")]
    public required decimal Price { get; set; }

    public Artist Artist { get; set; }
    public Genre Genre { get; set; }
}
