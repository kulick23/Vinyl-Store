using System;
using System.Threading;
using System.Threading.Tasks;
using Application.DTOs;
using DAL.Interfaces;
using Domain.Entities;
using Microsoft.AspNetCore.Identity;
using BLL.DTOs;
using BLL.Interfaces;

namespace BLL.Services
{
    public class AccountService : IAccountService
    {
        private readonly IAccountRepository _accountRepo;
        private readonly IEmailTokenRepository _emailTokenRepo;
        private readonly IPasswordResetTokenRepository _resetRepo;
        private readonly IUnitOfWork _uow;
        private readonly IPasswordHasher<Customer> _hasher;
        private readonly IJwtTokenGenerator _jwt;

        public AccountService(
            IAccountRepository accountRepo,
            IEmailTokenRepository emailTokenRepo,
            IPasswordResetTokenRepository resetRepo,
            IUnitOfWork uow,
            IPasswordHasher<Customer> hasher,
            IJwtTokenGenerator jwt)
        {
            _accountRepo = accountRepo;
            _emailTokenRepo = emailTokenRepo;
            _resetRepo = resetRepo;
            _uow = uow;
            _hasher = hasher;
            _jwt = jwt;
        }


        public async Task<AuthTokensDto> RegisterAsync(RegisterDto dto, CancellationToken ct = default)
        {
            if (await _accountRepo.EmailExistsAsync(dto.Email, ct))
                throw new InvalidOperationException("Email already exists.");

            var customer = new Customer
            {
                Email = dto.Email,
                FirstName = dto.FirstName,
                LastName = dto.LastName ?? string.Empty,
                CreatedAt = DateTime.UtcNow,
                IsEmailConfirmed = false
            };
            customer.PasswordHash = _hasher.HashPassword(customer, dto.Password);

            await _accountRepo.AddAsync(customer, ct);
            await _uow.SaveChangesAsync(ct);


            return await IssueTokensAsync(customer, ct);
        }


        public async Task<AuthTokensDto> LoginAsync(LoginDto dto, CancellationToken ct = default)
        {
            var customer = await _accountRepo.GetByEmailAsync(dto.Email, ct)
                           ?? throw new InvalidOperationException("Invalid credentials.");

            var res = _hasher.VerifyHashedPassword(customer, customer.PasswordHash, dto.Password);
            if (res == PasswordVerificationResult.Failed)
                throw new InvalidOperationException("Invalid credentials.");

            customer.LastLoginAt = DateTime.UtcNow;
            await _uow.SaveChangesAsync(ct);

            return await IssueTokensAsync(customer, ct);
        }


        public async Task<AuthTokensDto> RefreshAsync(string refreshToken, CancellationToken ct = default)
        {
            var token = await _accountRepo.GetRefreshTokenAsync(refreshToken, ct)
                        ?? throw new InvalidOperationException("Refresh token invalid.");

            if (token.ExpiresAt < DateTime.UtcNow || token.Revoked)
                throw new InvalidOperationException("Refresh token expired.");

            token.Revoked = true;
            var newRefresh = new RefreshToken
            {
                Token = _jwt.GenerateRefreshToken(),
                CustomerId = token.CustomerId,
                ExpiresAt = DateTime.UtcNow.AddDays(7)
            };
            await _accountRepo.AddRefreshTokenAsync(newRefresh, ct);
            await _uow.SaveChangesAsync(ct);

            string access = _jwt.GenerateAccessToken(token.Customer);

            return new AuthTokensDto(access, newRefresh.Token, DateTime.UtcNow.AddMinutes(15));
        }


        public async Task LogoutAsync(string refreshToken, CancellationToken ct = default)
        {
            await _accountRepo.RevokeRefreshTokenAsync(refreshToken, ct);
            await _uow.SaveChangesAsync(ct);
        }

        public async Task LogoutAllAsync(int customerId, CancellationToken ct = default)
        {
            await _accountRepo.RevokeAllRefreshTokensAsync(customerId, ct);
            await _uow.SaveChangesAsync(ct);
        }


        public async Task SendEmailConfirmationAsync(int customerId, CancellationToken ct = default)
        {
            var token = new EmailConfirmationToken
            {
                Token = Guid.NewGuid(),
                CustomerId = customerId,
                ExpiresAt = DateTime.UtcNow.AddHours(24)
            };
            await _emailTokenRepo.AddAsync(token, ct);
            await _uow.SaveChangesAsync(ct);


        }

        public async Task ConfirmEmailAsync(Guid tokenId, CancellationToken ct = default)
        {
            var token = await _emailTokenRepo.GetAsync(tokenId, ct)
                        ?? throw new InvalidOperationException("Token not found.");

            if (token.Used || token.ExpiresAt < DateTime.UtcNow)
                throw new InvalidOperationException("Token invalid.");

            token.Used = true;
            token.Customer.IsEmailConfirmed = true;

            await _uow.SaveChangesAsync(ct);
        }



        public async Task SendPasswordResetAsync(string email, CancellationToken ct = default)
        {
            var customer = await _accountRepo.GetByEmailAsync(email, ct);
            if (customer is null) return;

            var token = new PasswordResetToken
            {
                Token = Guid.NewGuid(),
                CustomerId = customer.Id,
                ExpiresAt = DateTime.UtcNow.AddHours(1)
            };
            await _resetRepo.AddAsync(token, ct);
            await _uow.SaveChangesAsync(ct);


        }

        public async Task ResetPasswordAsync(Guid tokenId, string newPassword, CancellationToken ct = default)
        {
            var token = await _resetRepo.GetAsync(tokenId, ct)
                        ?? throw new InvalidOperationException("Token not found.");

            if (token.Used || token.ExpiresAt < DateTime.UtcNow)
                throw new InvalidOperationException("Token invalid.");

            var customer = token.Customer;
            customer.PasswordHash = _hasher.HashPassword(customer, newPassword);

            token.Used = true;

            await _accountRepo.RevokeAllRefreshTokensAsync(customer.Id, ct);
            await _uow.SaveChangesAsync(ct);
        }



        private async Task<AuthTokensDto> IssueTokensAsync(Customer customer, CancellationToken ct)
        {
            string access = _jwt.GenerateAccessToken(customer);
            var refresh = new RefreshToken
            {
                Token = _jwt.GenerateRefreshToken(),
                CustomerId = customer.Id,
                ExpiresAt = DateTime.UtcNow.AddDays(7)
            };
            await _accountRepo.AddRefreshTokenAsync(refresh, ct);
            await _uow.SaveChangesAsync(ct);

            return new AuthTokensDto(access, refresh.Token, DateTime.UtcNow.AddMinutes(15));
        }
    }
}