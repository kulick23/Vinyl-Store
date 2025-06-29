using System;
using System.IdentityModel.Tokens.Jwt;
using System.Security.Claims;
using System.Security.Cryptography;
using System.Text;
using BLL.Interfaces;
using Domain.Entities;
using Microsoft.Extensions.Configuration;
using Microsoft.IdentityModel.Tokens;

namespace Web.Api.Auth
{
    public sealed class JwtTokenGenerator : IJwtTokenGenerator
    {
        private readonly IConfiguration _cfg;
        private readonly JwtSecurityTokenHandler _handler = new();

        private readonly string _issuer;
        private readonly string _audience;
        private readonly SymmetricSecurityKey _signingKey;
        private readonly TimeSpan _accessLife;

        public JwtTokenGenerator(IConfiguration configuration)
        {
            _cfg = configuration;

            _issuer = _cfg["Jwt:Issuer"] ?? "VinylMarket";
            _audience = _cfg["Jwt:Audience"] ?? "VinylMarket-SPA";
            var secret = _cfg["Jwt:Secret"] ?? throw new ArgumentNullException("Jwt:Secret");
            _accessLife = TimeSpan.FromMinutes(int.TryParse(_cfg["Jwt:AccessMinutes"], out var m) ? m : 15);

            _signingKey = new SymmetricSecurityKey(Encoding.UTF8.GetBytes(secret));
        }

        public string GenerateAccessToken(Customer user)
        {
            var adminEmail = _cfg["AdminAccount:Email"] ?? "admin@vinylheaven.com";

            string role =
                user.Email.Equals(adminEmail, StringComparison.OrdinalIgnoreCase)
                    ? "Admin"
                : user.SellerProfile is not null
                    ? "Seller"
                : "User";

            var claims = new[]
            {
                new Claim(JwtRegisteredClaimNames.Sub,  user.Id.ToString()),
                new Claim(JwtRegisteredClaimNames.Email,user.Email),
                new Claim("name", $"{user.FirstName} {user.LastName}".Trim()),
                new Claim(ClaimTypes.Role, role),
                new Claim(JwtRegisteredClaimNames.Jti,  Guid.NewGuid().ToString())
            };

            var creds = new SigningCredentials(_signingKey, SecurityAlgorithms.HmacSha256);

            var jwt = new JwtSecurityToken(
                issuer: _issuer,
                audience: _audience,
                claims: claims,
                notBefore: DateTime.UtcNow,
                expires: DateTime.UtcNow.Add(_accessLife),
                signingCredentials: creds);

            return _handler.WriteToken(jwt);
        }


        public string GenerateRefreshToken()
        {
            var bytes = RandomNumberGenerator.GetBytes(32);
            return Base64UrlEncoder.Encode(bytes);
        }
    }
}
