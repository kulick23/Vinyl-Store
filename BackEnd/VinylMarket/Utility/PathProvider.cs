using System.IO;
using BLL.Interfaces;
using Microsoft.AspNetCore.Hosting;

namespace VinylMarket.Infrastructure;

public sealed class PathProvider : IPathProvider
{
    public PathProvider(IWebHostEnvironment env)
    {
        ImagesRoot = Path.Combine(env.ContentRootPath, "images");
        Directory.CreateDirectory(ImagesRoot);
    }

    public string ImagesRoot { get; }
}
