using Domain.Entities;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;

namespace DAL.Conf
{
    public class CartItemConfiguration : IEntityTypeConfiguration<CartItem>
    {
        public void Configure(EntityTypeBuilder<CartItem> builder)
        {
            builder.HasKey(c => c.Id);

            builder.Property(c => c.Quantity)
                   .IsRequired();

            builder.HasOne(c => c.Customer)
                   .WithMany()
                   .HasForeignKey(c => c.CustomerId);

            builder.HasOne(c => c.InventoryItem)
                   .WithMany()
                   .HasForeignKey(c => c.InventoryItemId);

            builder.HasIndex(c => new { c.CustomerId, c.InventoryItemId })
                   .IsUnique();
        }
    }
}
