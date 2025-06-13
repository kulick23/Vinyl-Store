namespace NotificationsService.Providers;

public interface IEmailProvider
{
    Task SendEmailAsync(
        string recipientEmail,
        string subject,
        string htmlBody,
        CancellationToken ct = default);
}
