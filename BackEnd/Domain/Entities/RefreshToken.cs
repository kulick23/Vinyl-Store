using System;

namespace Domain.Entities
{
    public class RefreshToken : BaseEntity
    {
        public string Token { get; set; } = string.Empty;
        public int CustomerId { get; set; }
        public DateTime ExpiresAt { get; set; }
        public bool Revoked { get; set; }

        public Customer Customer { get; set; }
    }
}
