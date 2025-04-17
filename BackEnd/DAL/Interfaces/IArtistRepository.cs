using Domain.Entities;


namespace DAL.Interfaces
{
    public interface IArtistRepository : IRepository<Artist>
    {
        public Task<Artist> GetByName(string name);
    }
}
