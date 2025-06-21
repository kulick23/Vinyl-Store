using DAL.Data;
using Microsoft.EntityFrameworkCore.Design;
using Microsoft.EntityFrameworkCore;

public class AppDbContextFactory : IDesignTimeDbContextFactory<AppDbContext>
{
    public AppDbContext CreateDbContext(string[] args)
    {
        var optionsBuilder = new DbContextOptionsBuilder<AppDbContext>();

        var connectionString = Environment.GetEnvironmentVariable("ConnectionStrings__Railway")
                               ?? "Host=switchback.proxy.rlwy.net;Port=35085;Database=railway;Username=postgres;password=aYAkemLEtHtMucPYbVagzYQVMBLnBBOk;ssl Mode=Require;Trust Server Certificate=true;";

        optionsBuilder.UseNpgsql(connectionString);

        return new AppDbContext(optionsBuilder.Options);
    }
}