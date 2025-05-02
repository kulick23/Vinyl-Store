using Application.DTOs;
using Application.Services;
using AutoMapper;
using DAL.Interfaces;

namespace BLL.Services
{
    public class SellerProfileService : ISellerProfileService
    {
        private readonly ISellerProfileRepository _repo;
        private readonly IUnitOfWork _uow;
        private readonly IMapper _mapper;

        public SellerProfileService(ISellerProfileRepository repo, IUnitOfWork uow, IMapper mapper)
        {
            _repo = repo;
            _uow = uow;
            _mapper = mapper;
        }

        public async Task<SellerProfileDto?> GetProfileAsync(int sellerId, CancellationToken ct = default)
        {
            var entity = await _repo.GetByIdAsync(sellerId, ct);
            return entity is null ? null : _mapper.Map<SellerProfileDto>(entity);
        }

        public async Task UpdateProfileAsync(int sellerId, SellerProfileUpdateDto dto, CancellationToken ct = default)
        {
            var entity = await _repo.GetByIdAsync(sellerId, ct)
                         ?? throw new KeyNotFoundException();

            entity.DisplayName = dto.DisplayName;
            entity.Description = dto.Description;

            await _uow.SaveChangesAsync(ct);
        }
    }
}
