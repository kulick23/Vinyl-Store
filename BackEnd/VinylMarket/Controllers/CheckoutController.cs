using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using System.Security.Claims;

[ApiController]
[Route("api/checkout")]
[Authorize]
public class CheckoutController : ControllerBase
{
    private readonly ICheckoutService _svc;

    public CheckoutController(ICheckoutService svc) => _svc = svc;

    [HttpPost]
    public async Task<IActionResult> StartCheckout(CancellationToken ct = default)
    {
        int userId = int.Parse(User.FindFirstValue(ClaimTypes.NameIdentifier)!);

        var resp = await _svc.CreateOrUpdateIntentAsync(userId, ct);
        return Ok(resp);
    }
}
