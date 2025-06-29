using BLL.Services.Implementation;
using BLL.Services;
using BLL.Interfaces;
using DAL;
using DAL.Interfaces;
using DAL.Repositories;
using Domain.Entities;
using Microsoft.AspNetCore.Identity;
using Web.Api.Auth;
using DAL.Data;
using Microsoft.EntityFrameworkCore;
using BLL.AutoMapper;
using Common.Options;
using NotificationsService.Providers;
using VinylMarket.Infrastructure;
using System.Net.Http.Headers;
using Microsoft.AspNetCore.Authentication.Google;
using Stripe;
using StripeCustomer = Stripe.Customer;
using DbCustomer = Domain.Entities.Customer;
using BLL.Options;

namespace VinylRecordShop.Configurations
{
    public static class ServicesConfiguration
    {
        public static WebApplicationBuilder ConfigureServices(this WebApplicationBuilder builder)
        {
            var cfg = builder.Configuration;
            var services = builder.Services;

            // AutoMapper
            services.AddAutoMapper(typeof(ReleaseProfile).Assembly);
            services.AddAutoMapper(typeof(ArtistProfile).Assembly);
            services.AddAutoMapper(typeof(GenreProfile).Assembly);
            services.AddAutoMapper(typeof(CustomerProfile).Assembly);
            services.AddAutoMapper(typeof(ReviewProfile).Assembly);

            // BLL services
            services.AddScoped<IAccountService, BLL.Services.AccountService>();
            services.AddScoped<ICartService, CartService>();
            services.AddScoped<ICatalogService, CatalogService>();
            services.AddScoped<IInventoryService, InventoryService>();
            services.AddScoped<IOrderService, OrderService>();
            services.AddScoped<ISellerProfileService, SellerProfileService>();
            services.AddScoped<IWishlistService, WishlistService>();
            services.AddScoped<IAdminService, AdminService>();
            services.AddScoped<IReviewService, ReviewService>();
            services.AddScoped<ICheckoutService, CheckoutService>();

            // DAL repositories
            services.AddScoped<IAccountRepository, AccountRepository>();
            services.AddScoped<IReviewRepository, ReviewRepository>();
            services.AddScoped<ICartRepository, CartRepository>();
            services.AddScoped<ICartItemRepository, CartItemRepository>();
            services.AddScoped<ICustomerRepository, CustomerRepository>();
            services.AddScoped<IEmailTokenRepository, EmailTokenRepository>();
            services.AddScoped<IGenreRepository, GenreRepository>();
            services.AddScoped<IInventoryItemRepository, InventoryItemRepository>();
            services.AddScoped<IOrderRepository, OrderRepository>();
            services.AddScoped<IOrderItemRepository, OrderItemRepository>();
            services.AddScoped<IPasswordResetTokenRepository, PasswordResetTokenRepository>();
            services.AddScoped<IRecordReleaseRepository, RecordReleaseRepository>();
            services.AddScoped<IArtistRepository, ArtistRepository>();
            services.AddScoped<ISellerProfileRepository, SellerProfileRepository>();
            services.AddScoped<IUnitOfWork, UnitOfWork>();

            services.AddScoped<IDiscogsImportService, DiscogsImportService>();

            services.AddScoped<IJwtTokenGenerator, JwtTokenGenerator>();
            services.AddScoped<IPasswordHasher<Domain.Entities.Customer>, PasswordHasher<Domain.Entities.Customer>>();
            services.Configure<EmailOptions>(cfg.GetSection(EmailOptions.Section));
            services.AddTransient<IEmailProvider, EmailProvider>();

            services.AddScoped<IImageStore, ImageStore>();
            builder.Services.AddSingleton<IPathProvider, PathProvider>();

            services.AddHttpClient("Discogs", client =>
            {
                client.BaseAddress = new Uri("https://api.discogs.com/");

                var ua = builder.Configuration["Discogs:UserAgent"]
                      ?? "VinylMarketDev/1.0 (+https://vinyl.local)";
                client.DefaultRequestHeaders.TryAddWithoutValidation("User-Agent", ua);

                var pat = builder.Configuration["Discogs:PersonalAccessToken"];
                if (!string.IsNullOrWhiteSpace(pat))
                    client.DefaultRequestHeaders.TryAddWithoutValidation(
                        "Authorization", $"Discogs token={pat}");
            });

            builder.Services.Configure<StripeSettings>(
       builder.Configuration.GetSection("Stripe"));

            StripeConfiguration.ApiKey =
                builder.Configuration["Stripe:SecretKey"];
            var stripeSettings = builder.Configuration
                     .GetSection("Stripe")
                     .Get<StripeSettings>();
            Stripe.StripeConfiguration.ApiKey = stripeSettings.SecretKey;

            builder.Services.AddScoped<IPaymentService, StripePaymentService>();

            builder.Services.AddAuthentication().AddGoogle(googleOptions =>
                {
                    googleOptions.ClientId = builder.Configuration["Authentication:Google:ClientId"];
                    googleOptions.ClientSecret = builder.Configuration["Authentication:Google:ClientSecret"];
                });

            builder.Services.AddDbContext<AppDbContext>(opt =>
                opt.UseNpgsql(builder.Configuration.GetConnectionString("Railway")));

            return builder;
        }
    }
}