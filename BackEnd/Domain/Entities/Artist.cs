using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Domain.Entities
{
    public class Artist : BaseEntity
    {
        public required string Name { get; set; }

        public ICollection<VinylRecord> VinylRecords { get; set; }

    }
}
