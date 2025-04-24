using System.Threading;
using System.Threading.Tasks;
using DAL.Data;
using DAL.Interfaces;
using Domain.Entities;
using Microsoft.EntityFrameworkCore;

namespace DAL.Repositories
{
    public class CustomerRepository : Repository<Customer>, ICustomerRepository
    {
        public CustomerRepository(AppDbContext context) : base(context) { }

        public Task<Customer?> GetByEmailAsync(string email, CancellationToken ct = default) =>
            _dbSet.FirstOrDefaultAsync(c => c.Email == email, ct);
    }
}
