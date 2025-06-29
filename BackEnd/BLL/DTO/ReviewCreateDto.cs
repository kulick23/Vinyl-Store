namespace BLL.DTO;

public record ReviewCreateDto(byte Rating, string Comment, int SellerId);