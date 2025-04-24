using DAL.Data;
using DAL.Interfaces;
using Domain.Entities;

namespace DAL.Repositories
{
    public class InventoryItemRepository : Repository<InventoryItem>, IInventoryItemRepository
    {
        public InventoryItemRepository(AppDbContext context) : base(context) { }
    }
}
