using Domain.Entities;


namespace DAL.Interfaces
{
    public interface ICustomerRepository : IRepository<Customer>
    {
        public Task<Customer> GetByEmail(string? email);
    }
}
