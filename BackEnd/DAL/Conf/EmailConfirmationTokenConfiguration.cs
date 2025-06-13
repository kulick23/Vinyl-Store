using Domain.Entities;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;

namespace DAL.Conf
{
    public class EmailConfirmationTokenConfiguration : IEntityTypeConfiguration<EmailToken>
    {
        public void Configure(EntityTypeBuilder<EmailToken> b)
        {
            b.HasKey(t => t.Id);

            b.Property(t => t.TokenHash)
             .IsRequired();

            b.HasIndex(t => t.TokenHash).IsUnique();

            b.HasOne(t => t.Customer)
             .WithMany()
             .HasForeignKey(t => t.CustomerId)
             .OnDelete(DeleteBehavior.Cascade);
        }
    }
}