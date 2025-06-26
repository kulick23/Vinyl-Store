public interface IDiscogsClient
{
    Task<IReadOnlyList<SearchItem>> SearchPageAsync(int page, CancellationToken ct);
    Task<DiscogsReleaseDetails> GetReleaseAsync(int id, CancellationToken ct);
}