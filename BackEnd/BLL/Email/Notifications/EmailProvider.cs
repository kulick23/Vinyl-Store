using System.Net;
using System.Net.Mail;
using Microsoft.Extensions.Options;
using Common.Options;
using System.Net.Http;

namespace NotificationsService.Providers;

public sealed class EmailProvider : IEmailProvider
{
    private readonly SmtpClient _smtp;
    private readonly string _from;

    public EmailProvider(IOptions<EmailOptions> opt)
    {
        var o = opt.Value;
        _smtp = new SmtpClient(o.SmtpHost, o.SmtpPort)
        {
            Credentials = new NetworkCredential(o.SmtpName, o.SmtpPassword),
            EnableSsl = true,
            UseDefaultCredentials = false,
            DeliveryMethod = SmtpDeliveryMethod.Network
        };
        _from = o.FromAddress;
    }

    public async Task SendEmailAsync(
        string recipientEmail,
        string subject,
        string htmlBody,
        CancellationToken ct = default)
    {
        using var msg = new MailMessage
        {
            From = new MailAddress(_from),
            Subject = subject,
            IsBodyHtml = true,
            Body = htmlBody,
        };
        msg.To.Add(recipientEmail);

        await _smtp.SendMailAsync(msg, ct);
    }
}
