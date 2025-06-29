using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

[ApiController]
[Route("api/admin/discogs")]
[Authorize(Roles = "Admin")]
public sealed class DiscogsImportController : ControllerBase
{
    private readonly IDiscogsImportService _svc;
    public DiscogsImportController(IDiscogsImportService svc) => _svc = svc;

    [HttpPost("import")]
    public async Task<IActionResult> Import(
        [FromQuery] int count = 100,
        CancellationToken ct = default)
    {
        if (count is < 1 or > 100)
            return BadRequest("count 1 – 100");

        var (imported, skipped) = await _svc.ImportAsync(count, ct);
        return Ok(new { imported, skipped });
    }
}
