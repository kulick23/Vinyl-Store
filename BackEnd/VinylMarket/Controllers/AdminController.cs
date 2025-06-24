using BLL.DTO;
using AutoMapper;
using BLL.DTO;
using BLL.DTO;
using BLL.Interfaces;
using DAL.Interfaces;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace VinylMarket.Controllers
{
    [ApiController]
    //[Authorize(Roles = "Admin")]
    [Route("api/admin")]
    public class AdminController : ControllerBase
    {
        private readonly IAdminService _admin;

        public AdminController(IAdminService admin)
        {
            _admin = admin;
        }

        [HttpGet("artists")]
        public async Task<IActionResult> GetArtists(CancellationToken ct = default)
        {
            var result = await _admin.GetAllArtistsAsync(ct);
            return Ok(result);
        }

        [HttpPost("artists")]
        public async Task<IActionResult> CreateArtist([FromBody] ArtistDto dto, CancellationToken ct = default)
        {
            var created = await _admin.CreateArtistAsync(dto, ct);
            return Ok(created);
        }

        [HttpPut("artists/{id:int}")]
        public async Task<IActionResult> UpdateArtist(int id,
                                                     [FromBody] ArtistDto dto,
                                                     CancellationToken ct = default)
        {
            await _admin.UpdateArtistAsync(id, dto, ct);
            return NoContent();
        }

        [HttpDelete("artists/{id:int}")]
        public async Task<IActionResult> DeleteArtist(int id, CancellationToken ct = default)
        {
            await _admin.DeleteArtistAsync(id, ct);
            return NoContent();
        }

        [HttpGet("genres")]
        public async Task<IActionResult> GetGenres(CancellationToken ct = default)
        {
            var result = await _admin.GetAllGenresAsync(ct);
            return Ok(result);
        }

        [HttpPost("genres")]
        public async Task<IActionResult> CreateGenre([FromBody] GenreDto dto, CancellationToken ct = default)
        {
            var created = await _admin.CreateGenreAsync(dto, ct);
            return Ok(created);
        }

        [HttpPut("genres/{id:int}")]
        public async Task<IActionResult> UpdateGenre(int id,
                                                     [FromBody] GenreDto dto,
                                                     CancellationToken ct = default)
        {
            await _admin.UpdateGenreAsync(id, dto, ct);
            return NoContent();
        }

        [HttpDelete("genres/{id:int}")]
        public async Task<IActionResult> DeleteGenre(int id, CancellationToken ct = default)
        {
            await _admin.DeleteGenreAsync(id, ct);
            return NoContent();
        }

        [HttpGet("releases")]
        public async Task<IActionResult> GetReleases(CancellationToken ct = default)
        {
            var result = await _admin.GetAllReleasesAsync(ct);
            return Ok(result);
        }

        [HttpPost("releases")]
        public async Task<IActionResult> Create(
        [FromBody] ReleaseCreateDto dto,
        CancellationToken ct)
        {
            var created = await _admin.CreateReleaseAsync(dto, ct);
            return CreatedAtAction(nameof(GetRelease), new { id = created.Id }, created);
        }


        [HttpPut("releases/{id:int}")]
        public async Task<IActionResult> UpdateRelease(int id,
                                                       [FromBody] ReleaseUpdateDto dto,
                                                       CancellationToken ct = default)
        {
            await _admin.UpdateReleaseAsync(id, dto, ct);
            return NoContent();
        }

        [HttpDelete("releases/{id:int}")]
        public async Task<IActionResult> DeleteRelease(int id, CancellationToken ct = default)
        {
            await _admin.DeleteReleaseAsync(id, ct);
            return NoContent();
        }

        [HttpPut("releases/{id:int}/image")]
        [Consumes("multipart/form-data")]
        public async Task<IActionResult> UploadImage(
        int id,
        [FromForm] ImageUploadForm form,
        CancellationToken ct)
        {
            await _admin.UpdateReleaseImageAsync(id, form.Image, ct);
            return NoContent();
        }

        [AllowAnonymous]
        [HttpGet("releases/{id:int}", Name = "GetRelease")]
        public async Task<IActionResult> GetRelease(
    int id,
    [FromServices] IRecordReleaseRepository repo,
    CancellationToken ct)
        {
            var rel = await repo.GetByIdAsync(id, ct);
            return rel is null ? NotFound() : Ok(rel);
        }

        [HttpGet("sellers")]
        public async Task<IActionResult> GetSellers(CancellationToken ct = default)
        {
            var result = await _admin.GetAllSellersAsync(ct);
            return Ok(result);
        }

        [HttpPost("sellers")]
        public async Task<IActionResult> CreateSeller([FromBody] SellerProfileDto dto, CancellationToken ct = default)
        {
            var created = await _admin.CreateSellerAsync(dto, ct);
            return Ok(created);
        }

        [HttpPut("sellers/{id:int}")]
        public async Task<IActionResult> UpdateSeller(int id,
                                                      [FromBody] SellerProfileUpdateDto dto,
                                                      CancellationToken ct = default)
        {
            await _admin.UpdateSellerAsync(id, dto, ct);
            return NoContent();
        }

        [HttpDelete("sellers/{id:int}")]
        public async Task<IActionResult> DeleteSeller(int id, CancellationToken ct = default)
        {
            await _admin.DeleteSellerAsync(id, ct);
            return NoContent();
        }

        [HttpGet("users")]
        public async Task<IActionResult> GetUsers(CancellationToken ct = default)
        {
            var result = await _admin.GetAllUsersAsync(ct);
            return Ok(result);
        }

        [HttpPost("users")]
        public async Task<IActionResult> CreateUser([FromBody] CustomerDto dto, CancellationToken ct = default)
        {
            var created = await _admin.CreateUserAsync(dto, ct);
            return Ok(created);
        }

        [HttpPut("users/{id:int}")]
        public async Task<IActionResult> UpdateUser(int id,
                                                    [FromBody] CustomerUpdateDto dto,
                                                    CancellationToken ct = default)
        {
            await _admin.UpdateUserAsync(id, dto, ct);
            return NoContent();
        }

        [HttpDelete("users/{id:int}")]
        public async Task<IActionResult> DeleteUser(int id, CancellationToken ct = default)
        {
            await _admin.DeleteUserAsync(id, ct);
            return NoContent();
        }
    }
}
