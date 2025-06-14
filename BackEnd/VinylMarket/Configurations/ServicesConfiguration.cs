using Application.Services.Implementation;
using Application.Services;
using BLL.Interfaces;
using BLL.Services;
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

            // BLL services
            services.AddScoped<IAccountService, AccountService>();
            services.AddScoped<ICartService, CartService>();
            services.AddScoped<ICatalogService, CatalogService>();
            services.AddScoped<IInventoryService, InventoryService>();
            services.AddScoped<IOrderService, OrderService>();
            services.AddScoped<ISellerProfileService, SellerProfileService>();

            // DAL repositories
            services.AddScoped<IAccountRepository, AccountRepository>();
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


            //other
            services.AddScoped<IJwtTokenGenerator, JwtTokenGenerator>();
            services.AddScoped<IPasswordHasher<Customer>, PasswordHasher<Customer>>();
            services.Configure<EmailOptions>(cfg.GetSection(EmailOptions.Section));
            services.AddTransient<IEmailProvider, EmailProvider>();

            builder.Services.AddDbContext<AppDbContext>(opt =>
    opt.UseNpgsql(builder.Configuration.GetConnectionString("Default")));

            return builder;
        }
    }
}
