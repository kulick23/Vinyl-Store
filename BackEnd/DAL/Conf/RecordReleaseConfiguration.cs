using Domain.Entities;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;

namespace DAL.Conf
{
    public class RecordReleaseConfiguration : IEntityTypeConfiguration<RecordRelease>
    {
        public void Configure(EntityTypeBuilder<RecordRelease> builder)
        {
            builder.HasKey(r => r.Id);

            builder.Property(r => r.Title)
                   .IsRequired()
                   .HasMaxLength(200);

            builder.HasOne(r => r.Artist)
                   .WithMany(a => a.RecordReleases)
                   .HasForeignKey(r => r.ArtistId)
                   .OnDelete(DeleteBehavior.Restrict);

            builder.HasOne(r => r.Genre)
                   .WithMany(g => g.RecordReleases)
                   .HasForeignKey(r => r.GenreId)
                   .OnDelete(DeleteBehavior.Restrict);

            builder.HasMany(r => r.Listings)
                   .WithOne(l => l.Release)
                   .HasForeignKey(l => l.ReleaseId);

            builder.HasIndex(r => new { r.Title, r.ArtistId, r.Year });
        }
    }
}
