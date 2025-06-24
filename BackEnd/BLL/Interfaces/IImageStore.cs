using Microsoft.AspNetCore.Http;

public interface IImageStore
{
    Task<string> SaveImageAsync(IFormFile file, string folder, int maxPixels, CancellationToken ct = default);
    Task DeleteAsync(string relativePath);
}
