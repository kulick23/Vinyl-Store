using DAL.Data;
using DAL.Interfaces;
using Domain.Entities;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace DAL.Repositories
{
    public class GenreRepository(AppDbContext context) : Repository<Genre>(context), IGenreRepository
    {
    }
}
