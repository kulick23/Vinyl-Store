namespace BLL.Options;

public class StripeSettings
{
    public string SecretKey { get; init; } = null!;
    public string PublishableKey { get; init; } = null!;
    public string WebhookSecret { get; init; } = null!;
    public string FrontendUrl { get; init; } = null!;
}
