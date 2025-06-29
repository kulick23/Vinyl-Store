using System.Security.Claims;
using BLL.DTO;
using BLL.Interfaces;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace VinylMarket.Controllers;


[ApiController]
[Route("api/reviews")]
public sealed class ReviewsController : ControllerBase
{
    private readonly IReviewService _reviews;

    public ReviewsController(IReviewService reviews) => _reviews = reviews;

    private int CurrentUserId()
    {
        var sub = User.FindFirstValue(ClaimTypes.NameIdentifier);
        if (sub is null || !int.TryParse(sub, out int id))
            throw new UnauthorizedAccessException("No user id in token");
        return id;
    }

    [HttpPost]
    [Authorize]
    public async Task<IActionResult> AddReview(
        [FromBody] ReviewCreateDto dto,
        CancellationToken ct = default)
    {
        try
        {
            var userId = CurrentUserId();

            var created = await _reviews.AddReviewAsync(userId, dto, ct);

            return CreatedAtAction(nameof(GetSellerReviews),
                                   new { sellerId = dto.SellerId },
                                   created);
        }
        catch (InvalidOperationException ex)
        {
            // Handle business rule violations
            return BadRequest(new { message = ex.Message });
        }
        catch (KeyNotFoundException ex)
        {
            // Handle seller not found
            return NotFound(new { message = ex.Message });
        }
        catch (UnauthorizedAccessException ex)
        {
            // Handle authentication issues
            return Unauthorized(new { message = ex.Message });
        }
    }

    [HttpGet("seller/{sellerId:int}")]
    [AllowAnonymous]
    public async Task<IActionResult> GetSellerReviews(
        int sellerId,
        CancellationToken ct = default)
    {
        var list = await _reviews.GetSellerReviewsAsync(sellerId, ct);
        return Ok(list);
    }
}