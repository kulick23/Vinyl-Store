using Application.Services.Implementation;
using Application.Services;
using BLL.Interfaces;
using BLL.Services;
using DAL;
using DAL.Interfaces;
using DAL.Repositories;
using Microsoft.Extensions.DependencyInjection;
using Domain.Entities;
using Microsoft.AspNetCore.Identity;
using Web.Api.Auth;
using DAL.Data;
using Microsoft.EntityFrameworkCore;
using BLL.AutoMapper;
using Microsoft.AspNetCore.Authentication.JwtBearer;
using Microsoft.IdentityModel.Tokens;
using System.Text;

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

            builder.Services.AddDbContext<AppDbContext>(opt =>
    opt.UseNpgsql(builder.Configuration.GetConnectionString("Default")));

            var jwt = builder.Configuration.GetSection("Jwt");
            builder.Services
                .AddAuthentication(JwtBearerDefaults.AuthenticationScheme)
                .AddJwtBearer(opts =>
                {
                    opts.TokenValidationParameters = new TokenValidationParameters
                    {
                        ValidateIssuer = true,
                        ValidateAudience = true,
                        ValidateLifetime = true,
                        ValidateIssuerSigningKey = true,

                        ValidIssuer = jwt["Issuer"],
                        ValidAudience = jwt["Audience"],
                        IssuerSigningKey = new SymmetricSecurityKey(
                            Encoding.UTF8.GetBytes(jwt["Secret"]))
                    };
                });

            return builder;
        }
    }
}
