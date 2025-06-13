namespace Common.Options;

public class EmailOptions
{
    public const string Section = "Email";

    public required string SmtpHost { get; init; }
    public int SmtpPort { get; init; } = 587;
    public required string SmtpName { get; init; }
    public required string SmtpPassword { get; init; }
    public required string FromAddress { get; init; }
}
