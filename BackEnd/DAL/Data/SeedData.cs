using Domain.Entities;
using Microsoft.EntityFrameworkCore;

namespace DAL.Data
{
    public static class SeedData
    {
        public static async Task SeedDatabaseAsync(AppDbContext context)
        {
            if (await context.Set<Artist>().AnyAsync())
                return;

            var genres = new[]
            {
                new Genre { Name = "Rock" },
                new Genre { Name = "Jazz" },
                new Genre { Name = "Classical" },
                new Genre { Name = "Pop" },
                new Genre { Name = "Hip Hop" },
                new Genre { Name = "Electronic" },
                new Genre { Name = "Folk" },
                new Genre { Name = "Blues" }
            };

            context.Set<Genre>().AddRange(genres);
            await context.SaveChangesAsync();

            var artists = new[]
            {
                new Artist { Name = "The Beatles" },
                new Artist { Name = "Pink Floyd" },
                new Artist { Name = "Miles Davis" },
                new Artist { Name = "Mozart" },
                new Artist { Name = "Led Zeppelin" },
                new Artist { Name = "Daft Punk" },
                new Artist { Name = "Bob Dylan" },
                new Artist { Name = "B.B. King" },
                new Artist { Name = "Michael Jackson" },
                new Artist { Name = "Radiohead" }
            };

            context.Set<Artist>().AddRange(artists);
            await context.SaveChangesAsync();

            var rockGenre = await context.Set<Genre>().FirstAsync(g => g.Name == "Rock");
            var jazzGenre = await context.Set<Genre>().FirstAsync(g => g.Name == "Jazz");
            var classicalGenre = await context.Set<Genre>().FirstAsync(g => g.Name == "Classical");
            var popGenre = await context.Set<Genre>().FirstAsync(g => g.Name == "Pop");
            var electronicGenre = await context.Set<Genre>().FirstAsync(g => g.Name == "Electronic");
            var folkGenre = await context.Set<Genre>().FirstAsync(g => g.Name == "Folk");
            var bluesGenre = await context.Set<Genre>().FirstAsync(g => g.Name == "Blues");

            var beatles = await context.Set<Artist>().FirstAsync(a => a.Name == "The Beatles");
            var pinkFloyd = await context.Set<Artist>().FirstAsync(a => a.Name == "Pink Floyd");
            var milesDavis = await context.Set<Artist>().FirstAsync(a => a.Name == "Miles Davis");
            var mozart = await context.Set<Artist>().FirstAsync(a => a.Name == "Mozart");
            var ledZeppelin = await context.Set<Artist>().FirstAsync(a => a.Name == "Led Zeppelin");
            var daftPunk = await context.Set<Artist>().FirstAsync(a => a.Name == "Daft Punk");
            var bobDylan = await context.Set<Artist>().FirstAsync(a => a.Name == "Bob Dylan");
            var bbKing = await context.Set<Artist>().FirstAsync(a => a.Name == "B.B. King");
            var michaelJackson = await context.Set<Artist>().FirstAsync(a => a.Name == "Michael Jackson");
            var radiohead = await context.Set<Artist>().FirstAsync(a => a.Name == "Radiohead");

            var releases = new[]
            {
                new RecordRelease { 
                    Title = "Abbey Road", 
                    Year = 1969, 
                    ArtistId = beatles.Id, 
                    GenreId = rockGenre.Id,
                    ImageUrl = "https://upload.wikimedia.org/wikipedia/en/4/42/Beatles_-_Abbey_Road.jpg"
                },
                new RecordRelease { 
                    Title = "Sgt. Pepper's Lonely Hearts Club Band", 
                    Year = 1967, 
                    ArtistId = beatles.Id, 
                    GenreId = rockGenre.Id,
                    ImageUrl = "https://upload.wikimedia.org/wikipedia/en/5/50/Sgt._Pepper%27s_Lonely_Hearts_Club_Band.jpg"
                },
                new RecordRelease { 
                    Title = "The Dark Side of the Moon", 
                    Year = 1973, 
                    ArtistId = pinkFloyd.Id, 
                    GenreId = rockGenre.Id,
                    ImageUrl = "https://upload.wikimedia.org/wikipedia/en/3/3b/Dark_Side_of_the_Moon.png"
                },
                new RecordRelease { 
                    Title = "The Wall", 
                    Year = 1979, 
                    ArtistId = pinkFloyd.Id, 
                    GenreId = rockGenre.Id,
                    ImageUrl = "https://upload.wikimedia.org/wikipedia/en/1/13/PinkFloydWallCoverOriginalNoText.jpg"
                },
                new RecordRelease { 
                    Title = "Kind of Blue", 
                    Year = 1959, 
                    ArtistId = milesDavis.Id, 
                    GenreId = jazzGenre.Id,
                    ImageUrl = "https://upload.wikimedia.org/wikipedia/en/9/9c/MilesDavisKindofBlue.jpg"
                },
                new RecordRelease { 
                    Title = "Bitches Brew", 
                    Year = 1970, 
                    ArtistId = milesDavis.Id, 
                    GenreId = jazzGenre.Id,
                    ImageUrl = "https://upload.wikimedia.org/wikipedia/en/0/0b/Bitches_brew.jpg"
                },
                new RecordRelease { 
                    Title = "Symphony No. 40", 
                    Year = 1788, 
                    ArtistId = mozart.Id, 
                    GenreId = classicalGenre.Id,
                    ImageUrl = "https://upload.wikimedia.org/wikipedia/commons/thumb/4/47/Mozart_Symphony_40_score.jpg/512px-Mozart_Symphony_40_score.jpg"
                },
                new RecordRelease { 
                    Title = "Led Zeppelin IV", 
                    Year = 1971, 
                    ArtistId = ledZeppelin.Id, 
                    GenreId = rockGenre.Id,
                    ImageUrl = "https://upload.wikimedia.org/wikipedia/en/2/26/Led_Zeppelin_-_Led_Zeppelin_IV.jpg"
                },
                new RecordRelease { 
                    Title = "Random Access Memories", 
                    Year = 2013, 
                    ArtistId = daftPunk.Id, 
                    GenreId = electronicGenre.Id,
                    ImageUrl = "https://upload.wikimedia.org/wikipedia/en/a/a7/Random_Access_Memories.jpg"
                },
                new RecordRelease { 
                    Title = "Discovery", 
                    Year = 2001, 
                    ArtistId = daftPunk.Id, 
                    GenreId = electronicGenre.Id,
                    ImageUrl = "https://upload.wikimedia.org/wikipedia/en/2/27/Daft_Punk_-_Discovery.jpg"
                },
                new RecordRelease { 
                    Title = "Highway 61 Revisited", 
                    Year = 1965, 
                    ArtistId = bobDylan.Id, 
                    GenreId = folkGenre.Id,
                    ImageUrl = "https://upload.wikimedia.org/wikipedia/en/7/7a/Bob_Dylan_-_Highway_61_Revisited.jpg"
                },
                new RecordRelease { 
                    Title = "Thriller", 
                    Year = 1982, 
                    ArtistId = michaelJackson.Id, 
                    GenreId = popGenre.Id,
                    ImageUrl = "https://upload.wikimedia.org/wikipedia/en/5/55/Michael_Jackson_-_Thriller.png"
                }
            };

            context.Set<RecordRelease>().AddRange(releases);
            await context.SaveChangesAsync();

            Console.WriteLine($"Seeded {releases.Length} record releases");

            var dummyCustomer = new Customer
            {
                Email = "shop@vinylmarket.com",
                FirstName = "Vinyl",
                LastName = "Market",
                PasswordHash = "dummy",
                CreatedAt = DateTime.UtcNow.AddMonths(-6),
                IsEmailConfirmed = true
            };

            context.Set<Customer>().Add(dummyCustomer);
            await context.SaveChangesAsync();

            var dummySeller = new SellerProfile
            {
                CustomerId = dummyCustomer.Id,
                DisplayName = "Vinyl Market Store",
                Description = "Official Vinyl Market inventory with premium quality records",
                Rating = 4.8m
            };

            context.Set<SellerProfile>().Add(dummySeller);
            await context.SaveChangesAsync();

            var inventoryItems = new List<InventoryItem>();
            var random = new Random(42);
            var conditions = new[] { RecordCondition.Mint, RecordCondition.NearMint, RecordCondition.VGPlus, RecordCondition.VG, RecordCondition.Good };
            var basePrices = new decimal[] { 29.99m, 34.99m, 39.99m, 24.99m, 44.99m, 49.99m, 19.99m, 54.99m, 42.99m, 37.99m, 32.99m, 59.99m };

            for (int i = 0; i < releases.Length; i++)
            {
                var release = releases[i];
                var condition = conditions[random.Next(conditions.Length)];
                var basePrice = basePrices[i];
                
                var priceMultiplier = condition switch
                {
                    RecordCondition.Mint => 1.0m,
                    RecordCondition.NearMint => 0.9m,
                    RecordCondition.VGPlus => 0.8m,
                    RecordCondition.VG => 0.7m,
                    RecordCondition.Good => 0.6m,
                    _ => 1.0m
                };

                var inventoryItem = new InventoryItem
                {
                    ReleaseId = release.Id,
                    SellerId = dummySeller.Id,
                    Condition = condition,
                    Price = Math.Round(basePrice * priceMultiplier, 2),
                    Quantity = random.Next(1, 5),
                    Notes = $"High quality {condition} condition vinyl record",
                    CreatedAt = DateTime.UtcNow.AddDays(-random.Next(1, 30))
                };

                inventoryItems.Add(inventoryItem);
            }

            context.Set<InventoryItem>().AddRange(inventoryItems);
            await context.SaveChangesAsync();

            Console.WriteLine($"Seeded {inventoryItems.Count} inventory items with pricing and condition data");
        }
    }
} 