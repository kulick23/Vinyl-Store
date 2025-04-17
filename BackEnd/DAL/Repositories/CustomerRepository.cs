using DAL.Data;
using DAL.Interfaces;
using Domain.Entities;
using Microsoft.EntityFrameworkCore;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace DAL.Repositories
{
    public class CustomerRepository(AppDbContext context) : Repository<Customer>(context), ICustomerRepository
    {
        public async Task<Customer?> GetByEmail(string email)
        {
            return await _dbSet.FirstOrDefaultAsync(c => c.Email == email);
        }
    }
}
