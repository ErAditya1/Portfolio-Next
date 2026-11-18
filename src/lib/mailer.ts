import nodemailer from "nodemailer";

interface EnquiryEmailPayload {
  name: string;
  email: string;
  subject?: string;
  message: string;
  phone?: string;
  source?: "ai_agent" | "contact_portal";
}

function getTransporter() {
  const user = process.env.SMTP_USER;
  const pass = process.env.SMTP_PASS?.replace(/\s+/g, "");

  if (!user || !pass) {
    console.warn("[Mailer] SMTP credentials not fully configured in environment.");
    return null;
  }

  return nodemailer.createTransport({
    host: process.env.SMTP_HOST || "smtp.gmail.com",
    port: Number(process.env.SMTP_PORT) || 465,
    secure: process.env.SMTP_SECURE === "true" || Number(process.env.SMTP_PORT) === 465,
    auth: { user, pass },
  });
}

/**
 * Sends a stylized HTML email notification to Aditya when an enquiry is submitted,
 * and an automated warm receipt acknowledgment back to the visitor.
 */
export async function sendEnquiryNotification(payload: EnquiryEmailPayload) {
  const transporter = getTransporter();
  if (!transporter) return { success: false, error: "SMTP not configured" };

  const adminEmail = process.env.NOTIFICATION_EMAIL || process.env.SMTP_USER || "mradityaji2@gmail.com";
  const fromAddress = process.env.SMTP_FROM || `"Aditya Kumar Portfolio" <${process.env.SMTP_USER}>`;

  const isAgent = payload.source === "ai_agent";
  const badgeText = isAgent ? "🤖 AI AGENT LEAD (AG-UI)" : "📩 PORTAL CONTACT FORM";
  const badgeColor = isAgent ? "#6366f1" : "#10b981";
  const dateStr = new Date().toLocaleString("en-IN", { timeZone: "Asia/Kolkata" });

  const mailSubject = isAgent
    ? `[AI Agent Lead] ${payload.name}: ${payload.subject || "New Inquiry"}`
    : `[Portfolio Inquiry] ${payload.name}: ${payload.subject || "New Message"}`;

  const cleanPhone = payload.phone?.replace(/[^0-9]/g, "");
  const waUrl = cleanPhone ? `https://wa.me/${cleanPhone}` : null;

  // 1. Notification Email to Aditya
  const adminHtml = `
<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>${mailSubject}</title>
</head>
<body style="margin: 0; padding: 0; background-color: #0b0f19; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif; color: #f3f4f6;">
  <table role="presentation" width="100%" cellspacing="0" cellpadding="0" style="background-color: #0b0f19; padding: 30px 15px;">
    <tr>
      <td align="center">
        <table role="presentation" width="100%" style="max-width: 600px; background-color: #111827; border-radius: 20px; overflow: hidden; border: 1px solid #1f2937; box-shadow: 0 20px 40px rgba(0, 0, 0, 0.4);">
          
          <!-- Header Banner -->
          <tr>
            <td style="padding: 30px; background: linear-gradient(135deg, #1e1b4b 0%, #311042 100%); border-bottom: 1px solid #374151;">
              <table width="100%" cellspacing="0" cellpadding="0">
                <tr>
                  <td>
                    <span style="display: inline-block; padding: 4px 12px; background-color: ${badgeColor}; color: #ffffff; border-radius: 9999px; font-size: 11px; font-weight: 800; letter-spacing: 1px; text-transform: uppercase;">
                      ${badgeText}
                    </span>
                    <h1 style="margin: 12px 0 4px; font-size: 22px; font-weight: 900; color: #ffffff; letter-spacing: -0.5px;">
                      New Client Enquiry Received
                    </h1>
                    <p style="margin: 0; font-size: 13px; color: #9ca3af;">
                      Received on ${dateStr} IST
                    </p>
                  </td>
                </tr>
              </table>
            </td>
          </tr>

          <!-- Sender Details Card -->
          <tr>
            <td style="padding: 25px 30px 10px;">
              <table width="100%" cellspacing="0" cellpadding="0" style="background-color: #1f2937; border-radius: 14px; padding: 18px 20px; border: 1px solid #374151;">
                <tr>
                  <td style="padding-bottom: 10px;">
                    <span style="font-size: 11px; font-weight: 700; color: #9ca3af; text-transform: uppercase; letter-spacing: 0.5px;">Sender Name:</span><br>
                    <span style="font-size: 16px; font-weight: 800; color: #ffffff;">${payload.name}</span>
                  </td>
                </tr>
                <tr>
                  <td style="padding-bottom: 10px;">
                    <span style="font-size: 11px; font-weight: 700; color: #9ca3af; text-transform: uppercase; letter-spacing: 0.5px;">Email Address:</span><br>
                    <a href="mailto:${payload.email}" style="font-size: 14px; font-weight: 600; color: #818cf8; text-decoration: none;">${payload.email}</a>
                  </td>
                </tr>
                ${
                  payload.phone
                    ? `
                <tr>
                  <td style="padding-bottom: 10px;">
                    <span style="font-size: 11px; font-weight: 700; color: #9ca3af; text-transform: uppercase; letter-spacing: 0.5px;">Phone / WhatsApp:</span><br>
                    <span style="font-size: 14px; font-weight: 600; color: #34d399;">${payload.phone}</span>
                  </td>
                </tr>`
                    : ""
                }
                <tr>
                  <td>
                    <span style="font-size: 11px; font-weight: 700; color: #9ca3af; text-transform: uppercase; letter-spacing: 0.5px;">Subject:</span><br>
                    <span style="font-size: 14px; font-weight: 700; color: #f3f4f6;">${payload.subject || "Not Specified"}</span>
                  </td>
                </tr>
              </table>
            </td>
          </tr>

          <!-- Message Body -->
          <tr>
            <td style="padding: 15px 30px 25px;">
              <div style="font-size: 11px; font-weight: 700; color: #9ca3af; text-transform: uppercase; letter-spacing: 0.5px; margin-bottom: 8px;">
                Message Content:
              </div>
              <div style="background-color: #0f172a; border: 1px solid #1e293b; border-left: 4px solid #6366f1; border-radius: 12px; padding: 18px 20px; font-size: 14px; line-height: 1.6; color: #e2e8f0; white-space: pre-wrap;">
${payload.message}
              </div>
            </td>
          </tr>

          <!-- Quick Actions -->
          <tr>
            <td style="padding: 0 30px 30px;">
              <table width="100%" cellspacing="0" cellpadding="0">
                <tr>
                  <td>
                    <a href="mailto:${payload.email}?subject=Re: ${encodeURIComponent(payload.subject || "Your inquiry with Aditya Kumar")}" style="display: inline-block; background-color: #4f46e5; color: #ffffff; padding: 12px 24px; border-radius: 12px; font-size: 13px; font-weight: 700; text-decoration: none; margin-right: 10px;">
                      Reply via Email ✉️
                    </a>
                    ${
                      waUrl
                        ? `
                    <a href="${waUrl}" style="display: inline-block; background-color: #059669; color: #ffffff; padding: 12px 20px; border-radius: 12px; font-size: 13px; font-weight: 700; text-decoration: none;">
                      Chat on WhatsApp 💬
                    </a>`
                        : ""
                    }
                  </td>
                </tr>
              </table>
            </td>
          </tr>

          <!-- Footer -->
          <tr>
            <td style="padding: 20px 30px; background-color: #0c121e; border-top: 1px solid #1f2937; text-align: center; font-size: 12px; color: #6b7280;">
              Sent automatically from your portfolio portal (<a href="https://adityakr.site" style="color: #6366f1; text-decoration: none;">adityakr.site</a>)
            </td>
          </tr>

        </table>
      </td>
    </tr>
  </table>
</body>
</html>
`;

  // 2. Warm Confirmation Email to the Visitor
  const visitorHtml = `
<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Thank you for reaching out</title>
</head>
<body style="margin: 0; padding: 0; background-color: #0b0f19; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif; color: #f3f4f6;">
  <table role="presentation" width="100%" cellspacing="0" cellpadding="0" style="background-color: #0b0f19; padding: 30px 15px;">
    <tr>
      <td align="center">
        <table role="presentation" width="100%" style="max-width: 580px; background-color: #111827; border-radius: 20px; overflow: hidden; border: 1px solid #1f2937; box-shadow: 0 20px 40px rgba(0, 0, 0, 0.4);">
          
          <!-- Header -->
          <tr>
            <td style="padding: 30px; background: linear-gradient(135deg, #1e1b4b 0%, #1e3a8a 100%);">
              <h1 style="margin: 0 0 6px; font-size: 24px; font-weight: 900; color: #ffffff;">
                Hello ${payload.name}! 👋
              </h1>
              <p style="margin: 0; font-size: 14px; color: #93c5fd;">
                Thank you for reaching out through my portfolio.
              </p>
            </td>
          </tr>

          <!-- Body -->
          <tr>
            <td style="padding: 25px 30px;">
              <p style="font-size: 14px; line-height: 1.6; color: #d1d5db; margin: 0 0 16px;">
                I have received your message regarding <strong>${payload.subject || "your inquiry"}</strong>. I personally review all client inquiries, full-stack project requirements, and collaboration requests.
              </p>
              <p style="font-size: 14px; line-height: 1.6; color: #d1d5db; margin: 0 0 20px;">
                I will get back to you within <strong>24 hours</strong> with technical insights and next steps.
              </p>

              <!-- Copy of Message -->
              <div style="background-color: #1f2937; border-left: 4px solid #6366f1; border-radius: 10px; padding: 14px 18px; margin-bottom: 24px;">
                <div style="font-size: 11px; font-weight: 700; color: #9ca3af; text-transform: uppercase; margin-bottom: 6px;">A copy of your message:</div>
                <div style="font-size: 13px; color: #e5e7eb; font-style: italic; white-space: pre-wrap;">"${payload.message}"</div>
              </div>

              <!-- Urgent Connect -->
              <div style="background-color: #064e3b; border-radius: 12px; padding: 14px 18px; border: 1px solid #059669;">
                <p style="margin: 0; font-size: 13px; color: #a7f3d0;">
                  ⚡ Need an urgent response? You can also connect directly on WhatsApp at <a href="https://wa.me/919473774390" style="color: #ffffff; font-weight: 700; text-decoration: underline;">+91 9473774390</a>.
                </p>
              </div>
            </td>
          </tr>

          <!-- Signature -->
          <tr>
            <td style="padding: 0 30px 30px;">
              <p style="margin: 0; font-size: 13px; color: #9ca3af;">
                Warm regards,<br>
                <strong style="color: #ffffff; font-size: 15px;">Aditya Kumar</strong><br>
                <span style="font-size: 12px; color: #818cf8;">Full Stack Engineer & AI Systems Architect</span><br>
                <a href="https://adityakr.site" style="font-size: 12px; color: #9ca3af; text-decoration: none;">adityakr.site</a>
              </p>
            </td>
          </tr>

        </table>
      </td>
    </tr>
  </table>
</body>
</html>
`;

  try {
    // Send admin notification
    const adminPromise = transporter.sendMail({
      from: fromAddress,
      to: adminEmail,
      replyTo: payload.email,
      subject: mailSubject,
      text: `New Enquiry from ${payload.name} (${payload.email}):\n\nSubject: ${payload.subject || "None"}\n\nMessage:\n${payload.message}`,
      html: adminHtml,
    });

    // Send visitor acknowledgment (in background)
    const visitorPromise = transporter.sendMail({
      from: fromAddress,
      to: payload.email,
      subject: `Thank you for connecting with Aditya Kumar — We received your inquiry`,
      text: `Hello ${payload.name},\n\nThank you for reaching out. I have received your message regarding "${payload.subject || "your inquiry"}" and will get back to you within 24 hours.\n\nBest regards,\nAditya Kumar\nhttps://adityakr.site`,
      html: visitorHtml,
    });

    await Promise.allSettled([adminPromise, visitorPromise]);
    return { success: true };
  } catch (err) {
    console.error("[Mailer] Error sending email notification:", err);
    return { success: false, error: err instanceof Error ? err.message : "Unknown mailer error" };
  }
}
