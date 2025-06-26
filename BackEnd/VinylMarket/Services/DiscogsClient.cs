using Newtonsoft.Json;

public sealed class DiscogsClient : IDiscogsClient
{
    private readonly HttpClient _http;
    private readonly string _auth;   // key&secret

    public DiscogsClient(HttpClient http, IConfiguration cfg)
    {
        _http = http;
        var s = cfg.GetSection("Discogs");
        _auth = $"key={s["Key"]}&secret={s["Secret"]}";
    }

    public async Task<IReadOnlyList<SearchItem>> SearchPageAsync(int page, CancellationToken ct)
    {
        var url = $"/database/search?type=release&per_page=100&page={page}&{_auth}";
        var json = await _http.GetStringAsync(url, ct);
        return JsonConvert.DeserializeObject<SearchRoot>(json)!.Results;
    }

    public async Task<DiscogsReleaseDetails> GetReleaseAsync(int id, CancellationToken ct)
        => JsonConvert.DeserializeObject<DiscogsReleaseDetails>(
                await _http.GetStringAsync($"/releases/{id}?{_auth}", ct))!;

    private record SearchRoot(IReadOnlyList<SearchItem> Results);
}
