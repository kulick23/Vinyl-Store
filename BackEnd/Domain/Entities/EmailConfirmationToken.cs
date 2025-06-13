using System;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace Domain.Entities;

public class EmailToken : BaseEntity
{
    [MaxLength(64)]
    public required string TokenHash { get; set; }
    public required int CustomerId { get; set; }
    public DateTime ExpiresAt { get; set; }
    public bool IsConfirmed => ConfirmedAt is not null;
    public DateTime? ConfirmedAt { get; set; }
    public Customer Customer { get; set; } = null!;
}
