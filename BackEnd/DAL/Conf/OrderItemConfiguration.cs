using Domain.Entities;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;

namespace DAL.Conf
{
    public class OrderItemConfiguration : IEntityTypeConfiguration<OrderItem>
    {
        public void Configure(EntityTypeBuilder<OrderItem> builder)
        {
            builder.HasKey(o => o.Id);

            builder.Property(o => o.UnitPrice)
                   .HasColumnType("decimal(18,2)")
                   .IsRequired();

            builder.HasOne(o => o.Order)
                   .WithMany(o => o.OrderItems)
                   .HasForeignKey(o => o.OrderId);

            builder.HasOne(o => o.InventoryItem)
                   .WithMany()
                   .HasForeignKey(o => o.InventoryItemId);
        }
    }
}
