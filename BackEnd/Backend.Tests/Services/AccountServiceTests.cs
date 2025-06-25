using System.Threading;
using System.Threading.Tasks;
using AutoMapper;
using BLL.DTO;
using BLL.Interfaces;
using BLL.Services;
using DAL.Interfaces;
using Domain.Entities;
using FluentAssertions;
using Microsoft.AspNetCore.Identity;
using Microsoft.Extensions.Configuration;
using Moq;
using NotificationsService.Providers;
using Xunit;

namespace BLL.Tests;

public class AccountServiceTests
{
    private readonly Mock<IAccountRepository> _accountRepo = new();

    private readonly Mock<IEmailTokenRepository> _emailTokenRepo = new();

    private readonly Mock<IPasswordResetTokenRepository> _resetRepo = new();

    private readonly Mock<IUnitOfWork> _uow = new();

    private readonly Mock<IPasswordHasher<Customer>> _hasher = new();

    private readonly Mock<IJwtTokenGenerator> _jwt = new();

    private readonly Mock<IEmailProvider> _email = new();

    private readonly Mock<IConfiguration> _cfg = new();

    private readonly Mock<IMapper> _mapper = new();

    private AccountService CreateSut() => new(
        _accountRepo.Object,
        _emailTokenRepo.Object,
        _resetRepo.Object,
        _uow.Object,
        _hasher.Object,
        _jwt.Object,
        _email.Object,
        _cfg.Object,
        _mapper.Object);


    [Fact]
    public async Task GetByIdAsync_ReturnsMappedDto()
    {
        var customer = new Customer();
        var expected = new CustomerUpdateDto("e", "f", "l", "p");

        _accountRepo.Setup(r => r.GetByIdAsync(1, It.IsAny<CancellationToken>()))
            .ReturnsAsync(customer);

        _mapper.Setup(m => m.Map<CustomerUpdateDto>(customer))
            .Returns(expected);

        var sut = CreateSut();
        var result = await sut.GetByIdAsync(1, CancellationToken.None);

        result.Should().Be(expected);
    }

    [Fact]
    public async Task ConfirmEmailAsync_ReturnsFalse_WhenTokenInvalid()
    {
        _emailTokenRepo.Setup(r => r.GetValidAsync(It.IsAny<string>(), It.IsAny<CancellationToken>()))
            .ReturnsAsync((EmailToken?)null); 

        var sut = CreateSut();

        var ok = await sut.ConfirmEmailAsync("bad-token", CancellationToken.None);

        ok.Should().BeFalse();
    }
}
