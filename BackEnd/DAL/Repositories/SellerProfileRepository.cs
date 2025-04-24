using DAL.Data;
using DAL.Interfaces;
using Domain.Entities;

namespace DAL.Repositories
{
    public class SellerProfileRepository : Repository<SellerProfile>, ISellerProfileRepository
    {
        public SellerProfileRepository(AppDbContext context) : base(context) { }
    }
}
