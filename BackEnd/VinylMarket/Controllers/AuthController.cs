using System.Threading;
using System.Threading.Tasks;
using Application.DTOs;
using Application.Services;
using BLL.DTOs;
using BLL.Interfaces;
using Microsoft.AspNetCore.Mvc;

namespace VinylRecordShop.Api.Controllers
{
    [ApiController]
    [Route("api/auth")]
    public class AuthController : ControllerBase
    {
        private readonly IAccountService _account;

        public AuthController(IAccountService account)
        {
            _account = account;
        }

        [HttpPost("register")]
        public async Task<IActionResult> Register(
            [FromBody] RegisterDto dto,
            CancellationToken ct)
        {
            var tokens = await _account.RegisterAsync(dto, ct);
            return Ok(tokens);
        }


        [HttpPost("login")]
        public async Task<IActionResult> Login(
            [FromBody] LoginDto dto,
            CancellationToken ct)
        {
            var tokens = await _account.LoginAsync(dto, ct);
            return Ok(tokens);
        }

        [HttpPost("refresh")]
        public async Task<IActionResult> Refresh(
            [FromBody] string refreshToken,
            CancellationToken ct)
        {
            var tokens = await _account.RefreshAsync(refreshToken, ct);
            return Ok(tokens);
        }
    }
}
