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
    public class ArtistRepository(AppDbContext context) : Repository<Artist>(context), IArtistRepository
    {
        public async Task<Artist?> GetByName(string name)
        {
            return await _dbSet.FirstOrDefaultAsync(c => c.Name == name);
        }
    }
}
