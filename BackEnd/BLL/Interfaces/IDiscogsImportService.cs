
public interface IDiscogsImportService
{
    Task<(int imported, int skipped)> ImportAsync(int count = 100, CancellationToken ct = default);
}