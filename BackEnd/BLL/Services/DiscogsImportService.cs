using System.Text.Json;
using System.Net.Http.Json;
using Microsoft.EntityFrameworkCore;
using BLL.Interfaces;
using DAL.Interfaces;
using Domain.Entities;

namespace BLL.Services;

/// <summary>
/// Импорт релизов из Discogs по кнопке администратора.
/// </summary>
public sealed class DiscogsImportService : IDiscogsImportService
{
    private readonly HttpClient _http;
    private readonly IRecordReleaseRepository _releases;
    private readonly IArtistRepository _artists;
    private readonly IGenreRepository _genres;
    private readonly IUnitOfWork _uow;

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

    /* -------------------------------------------------------------------- */

    public async Task<(int imported, int skipped)> ImportAsync(
        int count = 100,
        CancellationToken ct = default)
    {
        // --- 1. Запрашиваем данные у Discogs --------------------------------
        string url = $"database/search?per_page={count}&" +
                     "type=release&sort=year&sort_order=desc";

        JsonElement root = await _http.GetFromJsonAsync<JsonElement>(url, ct);

        // --- 2. Преобразуем в DTO -------------------------------------------
        var list = root.GetProperty("results")
                       .EnumerateArray()
                       .Select(x =>
                       {
                           // year может быть строкой!
                           int year = x.TryGetProperty("year", out var y)
                                   && y.ValueKind == JsonValueKind.Number
                                   && y.TryGetInt32(out int yy) ? yy : 0;

                           string thumb = x.TryGetProperty("thumb", out var t)
                                        && t.ValueKind == JsonValueKind.String
                                          ? t.GetString() ?? string.Empty
                                          : string.Empty;

                           string artist = x.TryGetProperty("artist", out var a)
                                         && a.ValueKind == JsonValueKind.String
                                           ? a.GetString() ?? string.Empty
                                           : string.Empty;

                           // Если в JSON нет artist – вырезаем из заголовка до « - »
                           if (string.IsNullOrWhiteSpace(artist))
                           {
                               var raw = x.GetProperty("title").GetString() ?? "Unknown Artist";
                               int dash = raw.IndexOf(" - ", StringComparison.Ordinal);
                               artist = dash > 0 ? raw[..dash].Trim() : "Unknown Artist";
                           }

                           string genre = "Unknown";
                           if (x.TryGetProperty("genre", out var g) &&
                               g.ValueKind == JsonValueKind.Array &&
                               g.GetArrayLength() > 0)
                           {
                               genre = g[0].GetString() ?? "Unknown";
                           }

                           return new
                           {
                               Id = x.GetProperty("id").GetInt32(),   // для проверки дублей, если нужно
                               Title = x.GetProperty("title").GetString() ?? "Untitled",
                               Year = year,
                               ImageUrl = thumb,
                               Artist = artist,
                               Genre = genre
                           };
                       })
                       .ToList();

        // --- 3. Кеш существующих артистов / жанров ---------------------------
        var genreCache = (await _genres.Query()
                                        .AsNoTracking()
                                        .ToListAsync(ct))
                          .GroupBy(g => g.Name, StringComparer.OrdinalIgnoreCase)
                          .Select(g => g.First())
                          .ToDictionary(g => g.Name, StringComparer.OrdinalIgnoreCase);

        var artistCache = (await _artists.Query()
                                         .AsNoTracking()
                                         .ToListAsync(ct))
                          .GroupBy(a => a.Name, StringComparer.OrdinalIgnoreCase)
                          .Select(a => a.First())
                          .ToDictionary(a => a.Name, StringComparer.OrdinalIgnoreCase);

        // Гарантируем наличие «Unknown»
        await EnsureSpecialEntryAsync("Unknown", genreCache, _genres, ct);
        await EnsureSpecialEntryAsync("Unknown Artist", artistCache, _artists, ct);

        // --- 4. Импорт -------------------------------------------------------
        int imported = 0, skipped = 0;

        foreach (var dto in list)
        {
            int artistId = await GetOrCreateArtistAsync(dto.Artist, artistCache, _artists, ct);
            int genreId = await GetOrCreateGenreAsync(dto.Genre, genreCache, _genres, ct);

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
                ImageUrl = string.IsNullOrWhiteSpace(dto.ImageUrl)
                         ? "/images/default/stub.png"
                         : dto.ImageUrl
            };

            await _releases.AddAsync(rel, ct);
            imported++;
        }

        if (imported > 0)
            await _uow.SaveChangesAsync(ct);

        return (imported, skipped);
    }

    /* ======================= helpers ===================================== */

    private static async Task EnsureSpecialEntryAsync<T>(
        string name,
        Dictionary<string, T> cache,
        IRepository<T> repo,
        CancellationToken ct) where T : BaseEntity, new()
    {
        if (cache.ContainsKey(name)) return;

        var entity = new T();
        // у Genre/Artist свойство называется Name
        typeof(T).GetProperty("Name")!.SetValue(entity, name);

        await repo.AddAsync(entity, ct);
        cache[name] = entity;
    }

    private async Task<int> GetOrCreateArtistAsync(
        string name,
        Dictionary<string, Artist> cache,
        IArtistRepository repo,
        CancellationToken ct)
    {
        if (cache.TryGetValue(name, out var existing))
            return existing.Id;

        var entity = new Artist { Name = name };
        await repo.AddAsync(entity, ct);
        await _uow.SaveChangesAsync(ct);

        cache[name] = entity;
        return entity.Id;
    }

    private async Task<int> GetOrCreateGenreAsync(
        string name,
        Dictionary<string, Genre> cache,
        IGenreRepository repo,
        CancellationToken ct)
    {
        if (cache.TryGetValue(name, out var existing))
            return existing.Id;

        var entity = new Genre { Name = name };
        await repo.AddAsync(entity, ct);
        await _uow.SaveChangesAsync(ct);

        cache[name] = entity;
        return entity.Id;
    }
}