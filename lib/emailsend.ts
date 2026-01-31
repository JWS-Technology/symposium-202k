import { SESClient, SendRawEmailCommand } from "@aws-sdk/client-ses";

const sesClient = new SESClient({
  region: process.env.AWS_REGION || "us-east-1",
  credentials: {
    accessKeyId: process.env.AWS_ACCESS_KEY_ID!,
    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY!,
  },
});

export async function sendPaymentSuccessMailSES({
  to,
  name,
  teamId,
  amount,
}: any) {
  const sender = process.env.AWS_SES_SENDER!;
  const subject = "🕸️ ARAZON '26 - Registration Confirmed!";
  const baseUrl =
    process.env.NEXT_PUBLIC_BASE_URL || "https://symposium-202k.vercel.app/";

  const eventDetails = {
    date: "09.02.2026",
    time: "8:30 a.m - 5:30 p.m",
    venue: "Jubilee Hall, St. Joseph's College (Autonomous)",
    staffIncharge: "Dr. S. Hemalatha (9791434530)",
    studentSecretary: "Mr. V. Michael Vipin (6385266784)",
  };

  const htmlContent = `
    <div style="font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; max-width: 600px; border: 2px solid #ff003c; border-radius: 10px; overflow: hidden; background-color: #000; color: #fff; margin: auto;">
      <div style="background: linear-gradient(to right, #ff003c, #800000); padding: 25px; text-align: center;">
        <h1 style="margin: 0; font-size: 28px; letter-spacing: 3px; text-transform: uppercase;">ARAZON '26</h1>
        <p style="margin: 5px 0 0; font-style: italic; opacity: 0.9; font-size: 14px;">BEYOND THE BOOKS</p>
      </div>
      
      <div style="padding: 30px; line-height: 1.6;">
        <h2 style="color: #ff003c; margin-top: 0;">Payment Verified ✅</h2>
        <p>Hello <strong>${name}</strong>,</p>
        <p>Your payment for Team <strong>${teamId}</strong> has been confirmed. You are now officially cleared for the <strong>National Level Technical Symposium</strong>.</p>
        
        <div style="background-color: #111; border-left: 4px solid #ff003c; padding: 15px; margin: 25px 0;">
          <h3 style="margin-top: 0; color: #ff003c; font-size: 14px; letter-spacing: 1px;">📅 MISSION LOGISTICS</h3>
          <p style="margin: 5px 0; font-size: 14px;"><strong>Date:</strong> ${eventDetails.date}</p>
          <p style="margin: 5px 0; font-size: 14px;"><strong>Venue:</strong> ${eventDetails.venue}</p>
        </div>

        <div style="text-align: center; margin: 30px 0;">
          <p style="font-size: 14px; margin-bottom: 20px; color: #aaa;">Please review the protocol and timeline before arrival:</p>
          
          <a href="${baseUrl}/rules" style="display: inline-block; background-color: #ff003c; color: #fff; padding: 12px 25px; text-decoration: none; font-weight: bold; border-radius: 5px; margin: 5px; text-transform: uppercase; font-size: 13px; border: 1px solid #fff;">
            View Rules 📋
          </a>
          
          <a href="${baseUrl}/schedule" style="display: inline-block; background-color: #000; color: #00f0ff; padding: 12px 25px; text-decoration: none; font-weight: bold; border-radius: 5px; margin: 5px; text-transform: uppercase; font-size: 13px; border: 1px solid #00f0ff;">
            View Schedule ⏱️
          </a>
        </div>
        
        <hr style="border: 0; border-top: 1px solid #222; margin: 30px 0;">
        
        <p style="font-size: 12px; color: #888; margin-bottom: 5px;">SUPPORT_HOTLINE:</p>
        <p style="font-size: 13px; margin: 0; color: #ddd;">
          Student Secretary: ${eventDetails.studentSecretary}<br>
          Staff Incharge: ${eventDetails.staffIncharge}
        </p>
      </div>
      
      <div style="text-align: center; padding: 20px; background-color: #080808; font-size: 11px; color: #444; border-top: 1px solid #111;">
        DEPARTMENT OF IT • ST. JOSEPH'S COLLEGE (AUTONOMOUS) • TIRUCHIRAPPALLI
      </div>
    </div>
  `;

  try {
    const rawMessage = [
      `From: ARAZON 2K26 <${sender}>`,
      `To: ${to}`,
      `Subject: ${subject}`,
      `MIME-Version: 1.0`,
      `Content-Type: text/html; charset="UTF-8"`,
      ``,
      htmlContent,
    ].join("\r\n");

    const command = new SendRawEmailCommand({
      RawMessage: { Data: Buffer.from(rawMessage) },
    });

    const result = await sesClient.send(command);
    console.log(`✅ Confirmation Email (with links) sent to ${to}`);
    return { success: true };
  } catch (err: any) {
    console.error("❌ SES ERROR:", err.message);
    return { success: false, error: err.message };
  }
}
