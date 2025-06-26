using System.Net.Http;
using System.Net.Http.Json;
using System.Text.Json;
using DAL.Interfaces;
using Domain.Entities;

namespace BLL.Services;

public sealed class DiscogsImportService : IDiscogsImportService
{
    private readonly HttpClient _http;
    private readonly IRecordReleaseRepository _releases;
    private readonly IUnitOfWork _uow;

    public DiscogsImportService(
        IHttpClientFactory factory,
        IRecordReleaseRepository releases,
        IUnitOfWork uow)
    {
        _http = factory.CreateClient("Discogs");
        _releases = releases;
        _uow = uow;
    }

    public async Task<int> ImportAsync(int count = 100, CancellationToken ct = default)
    {
        string url = $"database/search?per_page={count}&type=release&sort=year&sort_order=desc";
        JsonElement root = await _http.GetFromJsonAsync<JsonElement>(url, ct);

        static int ToInt(JsonElement e)
    => e.ValueKind == JsonValueKind.Number ? e.GetInt32()
     : e.ValueKind == JsonValueKind.String && int.TryParse(e.GetString(), out var n) ? n
     : 0;

        var list = root.GetProperty("results")
                       .EnumerateArray()
                       .Select(x => new
                       {
                           Id = ToInt(x.GetProperty("id")),
                           Title = x.GetProperty("title").GetString() ?? "Untitled",
                           Year = ToInt(x.GetProperty("year")),
                           Thumb = x.TryGetProperty("thumb", out var t) ? t.GetString() : null
                       })
                       .ToList();

        int added = 0;

        foreach (var r in list)
        {

            if (_releases.Query().Any(q => q.ExternalId == r.Id))
                continue;

            await _releases.AddAsync(new RecordRelease
            {
                ExternalId = r.Id,
                Title = r.Title,
                Year = r.Year,
                ImageUrl = r.Thumb,
                ArtistId = 1,
                GenreId = 1
            }, ct);

            added++;
        }

        if (added > 0)
            await _uow.SaveChangesAsync(ct);

        return added;
    }
}