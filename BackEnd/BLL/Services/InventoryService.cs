using Application.DTOs;
using AutoMapper;
using DAL.Interfaces;
using Domain.Entities;
using Microsoft.EntityFrameworkCore;

namespace Application.Services.Implementation
{
    public class InventoryService : IInventoryService
    {
        private readonly IInventoryItemRepository _repo;
        private readonly IUnitOfWork _uow;
        private readonly IMapper _mapper;

        public InventoryService(IInventoryItemRepository repo, IUnitOfWork uow, IMapper mapper)
        {
            _repo = repo;
            _uow = uow;
            _mapper = mapper;
        }

        public async Task<InventoryItemDto> CreateListingAsync(int sellerId, InventoryItemCreateDto dto, CancellationToken ct = default)
        {
            var entity = _mapper.Map<InventoryItem>(dto);
            entity.SellerId = sellerId;

            await _repo.AddAsync(entity, ct);
            await _uow.SaveChangesAsync(ct);

            return _mapper.Map<InventoryItemDto>(entity);
        }

        public async Task UpdateListingAsync(int sellerId, int listingId, InventoryItemUpdateDto dto, CancellationToken ct = default)
        {
            var item = await _repo.GetByIdAsync(listingId, ct)
                       ?? throw new KeyNotFoundException();

            if (item.SellerId != sellerId)
                throw new UnauthorizedAccessException();

            if (dto.Price.HasValue) item.Price = dto.Price.Value;
            if (dto.Quantity.HasValue) item.Quantity = dto.Quantity.Value;
            if (dto.Condition.HasValue) item.Condition = dto.Condition.Value;
            if (dto.Notes is not null) item.Notes = dto.Notes;

            await _uow.SaveChangesAsync(ct);
        }

        public async Task ArchiveListingAsync(int sellerId, int listingId, CancellationToken ct = default)
        {
            var item = await _repo.GetByIdAsync(listingId, ct)
                       ?? throw new KeyNotFoundException();

            if (item.SellerId != sellerId)
                throw new UnauthorizedAccessException();

            item.Quantity = 0;
            await _uow.SaveChangesAsync(ct);
        }

        public async Task<IReadOnlyList<InventoryItemDto>> GetSellerListingsAsync(int sellerId, CancellationToken ct = default)
        {
            var list = await _repo.Query().Where(i => i.SellerId == sellerId).ToListAsync(ct);
            return _mapper.Map<IReadOnlyList<InventoryItemDto>>(list);
        }

        public async Task<InventoryItemDto?> GetListingAsync(int listingId, CancellationToken ct = default)
        {
            var item = await _repo.GetByIdAsync(listingId, ct);
            return item is null ? null : _mapper.Map<InventoryItemDto>(item);
        }
    }
}
