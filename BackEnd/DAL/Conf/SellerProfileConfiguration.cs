using Domain.Entities;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;

namespace DAL.Conf
{
    public class SellerProfileConfiguration : IEntityTypeConfiguration<SellerProfile>
    {
        public void Configure(EntityTypeBuilder<SellerProfile> builder)
        {
            builder.HasKey(s => s.Id);

            builder.Property(s => s.DisplayName)
                   .IsRequired()
                   .HasMaxLength(100);

            builder.Property(s => s.Rating)
                   .HasColumnType("decimal(3,2)")
                   .HasDefaultValue(0);

            builder.HasOne(s => s.Customer)
                   .WithOne(c => c.SellerProfile)
                   .HasForeignKey<SellerProfile>(s => s.CustomerId);

            builder.HasMany(s => s.Listings)
                   .WithOne(l => l.Seller)
                   .HasForeignKey(l => l.SellerId);
        }
    }
}
