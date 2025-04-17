using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Domain.Entities
{
    public class OrderItem : BaseEntity
    {
        public required int OrderId { get; set; }
        public required int VinylRecordId { get; set; }
        public required int Quantity { get; set; }
        public required decimal Price { get; set; }

        public Order Order { get; set; }
        public VinylRecord VinylRecord { get; set; }
    }
}
