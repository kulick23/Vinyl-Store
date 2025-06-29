using DAL.Data;
using Domain.Entities;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

namespace Web.Api.Controllers;

[Route("api/admin/seed")]
[Authorize(Roles = "Admin")]
[ApiController]
public sealed class AdminSeedController(AppDbContext ctx) : ControllerBase
{
    [HttpPost]
    public async Task<IActionResult> Seed(CancellationToken ct)
    {
        var already = await ctx.Set<Artist>().AnyAsync(ct);
        if (already)
            return BadRequest("Seed уже выполнен.");

        await SeedData.SeedDatabaseAsync(ctx);
        return Ok("Seed завершён.");
    }
}
