using SixLabors.ImageSharp.Processing;
using SixLabors.ImageSharp;

public sealed class ImageStore : IImageStore
{
    private readonly string _root;

    public ImageStore(IWebHostEnvironment env)
    {
        var webRoot = string.IsNullOrWhiteSpace(env.WebRootPath)
            ? Path.Combine(env.ContentRootPath, "wwwroot")
            : env.WebRootPath;

        _root = Path.Combine(webRoot, "images");

        Directory.CreateDirectory(_root);
    }

    public async Task<string> SaveImageAsync(
        IFormFile file, string folder, int maxPixels, CancellationToken ct = default)
    {
        if (!file.ContentType.StartsWith("image/"))
            throw new InvalidOperationException("Not an image file");

        using var image = await SixLabors.ImageSharp.Image.LoadAsync(file.OpenReadStream(), ct);

        image.Mutate(x => x.Resize(new ResizeOptions
        {
            Mode = ResizeMode.Max,
            Size = new Size(maxPixels, maxPixels)
        }));

        string name = $"{Guid.NewGuid():N}.jpg";
        string rel = Path.Combine("images", folder, name);
        string abs = Path.Combine(_root, folder, name);

        Directory.CreateDirectory(Path.GetDirectoryName(abs)!);

        await image.SaveAsJpegAsync(
            abs,
            new SixLabors.ImageSharp.Formats.Jpeg.JpegEncoder { Quality = 75 }, ct);

        return "/" + rel.Replace("\\", "/");
    }

    public Task DeleteAsync(string relPath)
    {
        var abs = Path.Combine(_root, relPath.TrimStart('/').Replace('/', Path.DirectorySeparatorChar));
        if (File.Exists(abs)) File.Delete(abs);
        return Task.CompletedTask;
    }
}
