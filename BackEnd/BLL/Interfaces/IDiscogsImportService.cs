
public interface IDiscogsImportService
{
    Task<int> ImportAsync(int count = 100, CancellationToken ct = default);
}