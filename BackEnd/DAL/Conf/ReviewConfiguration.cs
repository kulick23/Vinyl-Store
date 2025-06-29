using Domain.Entities;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;

namespace DAL.Conf
{
    public sealed class ReviewConfiguration : IEntityTypeConfiguration<Review>
    {
        public void Configure(EntityTypeBuilder<Review> b)
        {
            b.HasKey(r => r.Id);

            b.Property(r => r.Rating)
             .IsRequired();

            b.Property(r => r.Comment)
             .HasMaxLength(500);

            b.HasOne(r => r.Seller)
             .WithMany(s => s.Reviews)
             .HasForeignKey(r => r.SellerId)
             .OnDelete(DeleteBehavior.Cascade);

            b.HasOne(r => r.Customer)
             .WithMany()
             .HasForeignKey(r => r.CustomerId)
             .OnDelete(DeleteBehavior.Restrict);
        }
    }
}
