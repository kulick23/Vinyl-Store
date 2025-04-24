using Domain.Entities;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;

namespace DAL.Conf
{
    public class InventoryItemConfiguration : IEntityTypeConfiguration<InventoryItem>
    {
        public void Configure(EntityTypeBuilder<InventoryItem> builder)
        {
            builder.HasKey(i => i.Id);

            builder.Property(i => i.Price)
                   .HasColumnType("decimal(18,2)")
                   .IsRequired();

            builder.Property(i => i.Quantity)
                   .IsRequired();

            builder.Property(i => i.Condition)
                   .HasConversion<string>()   // enum → string
                   .IsRequired();

            builder.Property(i => i.CreatedAt)
                   .HasDefaultValueSql("CURRENT_TIMESTAMP");

            builder.HasOne(i => i.Release)
                   .WithMany(r => r.Listings)
                   .HasForeignKey(i => i.ReleaseId);

            builder.HasOne(i => i.Seller)
                   .WithMany(s => s.Listings)
                   .HasForeignKey(i => i.SellerId);

            builder.HasIndex(i => new { i.ReleaseId, i.Price });
        }
    }
}
