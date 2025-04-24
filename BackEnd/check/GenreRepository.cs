using DAL.Data;
using DAL.Interfaces;
using Domain.Entities;

namespace DAL.Repositories
{
    public class GenreRepository : Repository<Genre>, IGenreRepository
    {
        public GenreRepository(AppDbContext context) : base(context) { }
    }
}
