using System;

namespace Domain.Entities
{
    public class EmailConfirmationToken : BaseEntity
    {
        public Guid Token { get; set; }
        public int CustomerId { get; set; }
        public DateTime ExpiresAt { get; set; }
        public bool Used { get; set; }

        public Customer Customer { get; set; }
    }
}
