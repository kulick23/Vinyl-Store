using Microsoft.AspNetCore.Http;
using System.ComponentModel.DataAnnotations;

namespace Application.DTOs;

public class ImageUploadForm
{
    [Required] public IFormFile Image { get; set; } = null!;
}
