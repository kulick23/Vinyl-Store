using System.Net.Http;
using System.Net.Http.Json;
using System.Text.Json;
using DAL.Interfaces;
using Domain.Entities;
using Microsoft.EntityFrameworkCore;

namespace BLL.Services;

public sealed class DiscogsImportService : IDiscogsImportService
{
    private readonly HttpClient _http;
    private readonly IRecordReleaseRepository _releases;
    private readonly IUnitOfWork _uow;
    private readonly IArtistRepository _artists;
    private readonly IGenreRepository _genres;

    public DiscogsImportService(
        IHttpClientFactory factory,
        IRecordReleaseRepository releases,
        IArtistRepository artists,
        IGenreRepository genres,
        IUnitOfWork uow)
    {
        _http = factory.CreateClient("Discogs");
        _releases = releases;
        _artists = artists;
        _genres = genres;
        _uow = uow;
    }

    private sealed record DiscogsRelDto(
    int Id,
    string Title,
    int Year,
    string ImageUrl,
    string ArtistName,
    string GenreName);

    public async Task<(int imported, int skipped)> ImportAsync(
    int count = 100,
    CancellationToken ct = default)
    {
        string url =
            $"database/search?per_page={count}&type=release&sort=year&sort_order=desc";

        JsonElement root = await _http.GetFromJsonAsync<JsonElement>(url, ct);

        var list = root.GetProperty("results")
                       .EnumerateArray()
                       .Select(x =>
                       {
                           int year = 0;
                           if (x.TryGetProperty("year", out var y))
                           {
                               if (y.ValueKind == JsonValueKind.Number)
                                   year = y.GetInt32();
                               else if (y.ValueKind == JsonValueKind.String &&
                                        int.TryParse(y.GetString(), out var yy))
                                   year = yy;
                           }

                           string titleRaw = x.GetProperty("title").GetString() ?? "Untitled";
                           string artist = x.TryGetProperty("artist", out var a)
                                           ? a.GetString() ?? string.Empty
                                           : string.Empty;

                           if (string.IsNullOrWhiteSpace(artist))
                           {
                               int dash = titleRaw.IndexOf(" - ", StringComparison.Ordinal);
                               if (dash > 0)
                                   artist = titleRaw[..dash].Trim();
                               else
                                   artist = "Unknown Artist";
                           }

                           string title = titleRaw;
                           int idx = titleRaw.IndexOf(" - ", StringComparison.Ordinal);
                           if (idx > 0) title = titleRaw[(idx + 3)..].Trim();

                           string genre = "Unknown";
                           if (x.TryGetProperty("genre", out var g) &&
                               g.ValueKind == JsonValueKind.Array &&
                               g.GetArrayLength() > 0)
                           {
                               genre = g[0].GetString() ?? "Unknown";
                           }

                           string img = "/default/stub.png";
                           if (x.TryGetProperty("thumb", out var t))
                           {
                               var s = t.GetString();
                               if (!string.IsNullOrWhiteSpace(s)) img = s;
                           }

                           return new DiscogsRelDto(
                               Id: x.GetProperty("id").GetInt32(),
                               Title: title,
                               Year: year,
                               ImageUrl: img,
                               ArtistName: artist,
                               GenreName: genre);
                       })
                       .ToList();

        int imported = 0, skipped = 0;

        foreach (var dto in list)
        {
            int artistId = await GetOrCreateArtistAsync(dto.ArtistName, ct);
            int genreId = await GetOrCreateGenreAsync(dto.GenreName, ct);

            bool exists = await _releases.Query()
                .AnyAsync(r => r.Title == dto.Title &&
                               r.ArtistId == artistId &&
                               r.Year == dto.Year, ct);

            if (exists) { skipped++; continue; }

            var rel = new RecordRelease
            {
                Title = dto.Title,
                Year = dto.Year,
                ArtistId = artistId,
                GenreId = genreId,
                ImageUrl = dto.ImageUrl
            };

            await _releases.AddAsync(rel, ct);
            imported++;
        }

        await _uow.SaveChangesAsync(ct);
        return (imported, skipped);
    }


    private async Task<int> GetOrCreateArtistAsync(string name, CancellationToken ct)
    {
        var artist = await _artists.Query()
                       .FirstOrDefaultAsync(a => a.Name == name, ct);

        if (artist != null) return artist.Id;

        artist = new Artist { Name = name };
        await _artists.AddAsync(artist, ct);
        await _uow.SaveChangesAsync(ct);
        return artist.Id;
    }

    private async Task<int> GetOrCreateGenreAsync(string name, CancellationToken ct)
    {
        var genre = await _genres.Query()
                      .FirstOrDefaultAsync(g => g.Name == name, ct);

        if (genre != null) return genre.Id;

        genre = new Genre { Name = name };
        await _genres.AddAsync(genre, ct);
        await _uow.SaveChangesAsync(ct);
        return genre.Id;
    }

    private static string ResolveArtist(JsonElement e, string title)
    {
        if (e.TryGetProperty("artist", out var a) &&
            a.ValueKind == JsonValueKind.String &&
            !string.IsNullOrWhiteSpace(a.GetString()))
            return a.GetString()!;

        if (e.TryGetProperty("artist_credit", out var ac) &&
            ac.ValueKind == JsonValueKind.Array &&
            ac.GetArrayLength() > 0 &&
            ac[0].TryGetProperty("name", out var n) &&
            n.ValueKind == JsonValueKind.String &&
            !string.IsNullOrWhiteSpace(n.GetString()))
            return n.GetString()!;

        var parts = title.Split('-', 2, StringSplitOptions.TrimEntries);
        return parts.Length > 1 ? parts[0] : "Unknown";
    }
}