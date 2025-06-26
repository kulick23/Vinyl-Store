public record DiscogsReleaseDetails(
    int Id, string Title, int Year,
    DiscArtist[] Artists, string[] Genres, DiscImage[] Images);