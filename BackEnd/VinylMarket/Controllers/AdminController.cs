using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace VinylMarket.Controllers
{
    [ApiController]
    [Authorize(Roles="Admin")]
    [Route("api/admin")]
    public class AdminController : Controller
    {
        [HttpGet]
        public IActionResult Index()
        {
            return View();
        }

        //[HttpGet("genres")]
        //public IActionResult Get() { }


    }
}
