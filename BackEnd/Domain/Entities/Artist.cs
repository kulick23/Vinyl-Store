using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Domain.Entities
{
    public class Artist : BaseEntity
    {
        public string Name { get; set; } = string.Empty;

        public ICollection<RecordRelease> RecordReleases { get; set; } = new List<RecordRelease>();

    }
}
