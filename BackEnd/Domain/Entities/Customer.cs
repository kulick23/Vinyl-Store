using System;
using System.Collections.Generic;

namespace Domain.Entities
{
    public class Customer : BaseEntity
    {

        public string Email { get; set; } = string.Empty;
        public string PasswordHash { get; set; } = string.Empty;
        public bool IsEmailConfirmed { get; set; }

        public string FirstName { get; set; } = string.Empty;
        public string LastName { get; set; } = string.Empty;
        public string Phone { get; set; } = string.Empty;


        public DateTime CreatedAt { get; set; } = DateTime.UtcNow;
        public DateTime? LastLoginAt { get; set; }


        public SellerProfile? SellerProfile { get; set; }
        public ICollection<Order> Orders { get; set; } = new List<Order>();
    }
}