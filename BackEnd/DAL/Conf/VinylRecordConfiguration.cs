using Domain.Entities;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Reflection.Emit;
using System.Text;
using System.Threading.Tasks;

namespace DAL.Conf
{
    public class VinylRecordConfiguration : IEntityTypeConfiguration<VinylRecord>
    {
        public void Configure(EntityTypeBuilder<VinylRecord> builder)
        {
            builder.HasKey(c => c.Id);

            builder
                .HasOne(v => v.Artist)
                .WithMany(v => v.VinylRecords)
                .HasForeignKey(v => v.ArtistId);

            builder
                .HasOne(v => v.Genre)
                .WithMany(v => v.VinylRecords)
                .HasForeignKey(v => v.GenreId);
        }
    }
}
