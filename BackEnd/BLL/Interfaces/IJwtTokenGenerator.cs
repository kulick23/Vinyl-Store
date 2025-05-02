using Domain.Entities;

namespace BLL.Interfaces
{
    public interface IJwtTokenGenerator
    {
        string GenerateAccessToken(Customer customer);
        string GenerateRefreshToken();
    }
}
