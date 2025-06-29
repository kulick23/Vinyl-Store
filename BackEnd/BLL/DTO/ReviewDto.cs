namespace BLL.DTO;

public record ReviewDto(int Id, byte Rating, string Comment,
                        int CustomerId, DateTime Created, string CustomerName);