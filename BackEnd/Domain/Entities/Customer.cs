using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Domain.Entities
{
    public class Customer : BaseEntity
    {
        public required string FirstName { get; set; }
        public string LastName { get; set; } = string.Empty;
        public required string Email { get; set; }
        public string Phone { get; set; } = string.Empty;
        public required string Password { get; set; }
        public required string Adress { get; set; } = string.Empty;

        public required string Role { get; set; }

        public ICollection<Order> Orders { get; set; }
    }
}
