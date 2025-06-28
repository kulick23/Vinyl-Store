# syntax=docker/dockerfile:1

# ---------- build ----------
FROM mcr.microsoft.com/dotnet/sdk:9.0 AS build
WORKDIR /src

COPY backend.sln .
COPY VinylMarket/VinylMarket.csproj VinylMarket/
COPY DAL/DAL.csproj DAL/
COPY BLL/BLL.csproj BLL/
COPY Domain/Domain.csproj Domain/
COPY Backend.Tests/Backend.Tests.csproj Backend.Tests/

RUN dotnet restore backend.sln

COPY . .
RUN dotnet publish VinylMarket/VinylMarket.csproj \
    -c Release -o /app/publish /p:UseAppHost=false

# ---------- runtime ----------
FROM mcr.microsoft.com/dotnet/aspnet:9.0 AS runtime
WORKDIR /app

COPY --from=build /app/publish .

ENTRYPOINT ["dotnet", "VinylMarket.dll"]
EXPOSE 80
