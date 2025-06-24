using Microsoft.AspNetCore.Http;
using System.ComponentModel.DataAnnotations;

namespace BLL.DTO;

public class ImageUploadForm
{
    [Required] public IFormFile Image { get; set; } = null!;
}
