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

            builder.HasOne(c => c.Cart)
              .WithMany(c => c.Items)
              .HasForeignKey(c => c.CartId)
              .OnDelete(DeleteBehavior.Cascade);

            builder.HasOne(c => c.InventoryItem)
                   .WithMany()
                   .HasForeignKey(c => c.InventoryItemId);

            builder.HasIndex(c => new { c.CartId, c.InventoryItemId })
                   .IsUnique();
        }
    }
}
