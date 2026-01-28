import { SESClient, SendRawEmailCommand } from "@aws-sdk/client-ses";
import fs from "fs";
import path from "path";

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
  const boundary = `----=_Part_${Math.random().toString(36).substring(2)}`;

  // Event details from the poster
  const eventDetails = {
    date: "09.02.2026",
    time: "8:30 a.m - 5:30 p.m",
    venue: "Jubilee Hall, St. Joseph's College (Autonomous)",
    staffIncharge: "Dr. S. Hemalatha (9791434530)",
    studentSecretary: "Mr. V. Michael Vipin (6385266784)",
  };

  const htmlContent = `
    <div style="font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; max-width: 600px; border: 2px solid #ff003c; border-radius: 10px; overflow: hidden; background-color: #000; color: #fff;">
      <div style="background: linear-gradient(to right, #ff003c, #800000); padding: 20px; text-align: center;">
        <h1 style="margin: 0; font-size: 28px; letter-spacing: 2px;">ARAZON '26</h1>
        <p style="margin: 5px 0 0; font-style: italic; opacity: 0.8;">BEYOND THE BOOKS</p>
      </div>
      
      <div style="padding: 30px; line-height: 1.6;">
        <h2 style="color: #ff003c;">Payment Verified ✅</h2>
        <p>Hello <strong>${name}</strong>,</p>
        <p>Welcome to the <strong>National Level Technical Symposium</strong>. Your payment of ₹${amount} for Team <strong>${teamId}</strong> has been successfully confirmed.</p>
        
        <div style="background-color: #111; border-left: 4px solid #ff003c; padding: 15px; margin: 20px 0;">
          <h3 style="margin-top: 0; color: #ff003c; font-size: 16px;">📅 EVENT LOGISTICS</h3>
          <p style="margin: 5px 0;"><strong>Date:</strong> ${eventDetails.date}</p>
          <p style="margin: 5px 0;"><strong>Time:</strong> ${eventDetails.time}</p>
          <p style="margin: 5px 0;"><strong>Venue:</strong> ${eventDetails.venue}</p>
        </div>

        <p>Attached to this email, you will find the <strong>ARAZON_RULES.pdf</strong>. Please go through it carefully before the event.</p>
        
        <hr style="border: 0; border-top: 1px solid #333; margin: 25px 0;">
        
        <p style="font-size: 12px; color: #888;">For any queries, contact:</p>
        <p style="font-size: 13px;">
          Student Secretary: ${eventDetails.studentSecretary}<br>
          Staff Incharge: ${eventDetails.staffIncharge}
        </p>
      </div>
      
      <div style="text-align: center; padding: 15px; background-color: #080808; font-size: 11px; color: #555;">
        Department of IT, St. Joseph's College (Autonomous), Tiruchirappalli.
      </div>
    </div>
  `;

  try {
    const filePath = path.join(process.cwd(), "public", "ARAZON_RULES.pdf");
    if (!fs.existsSync(filePath))
      throw new Error(`FILE_NOT_FOUND: ${filePath}`);

    const fileBuffer = fs.readFileSync(filePath);
    const pdfBase64 = fileBuffer.toString("base64");

    const rawMessage = [
      `From: ARAZON 2K26 <${sender}>`,
      `To: ${to}`,
      `Subject: ${subject}`,
      `MIME-Version: 1.0`,
      `Content-Type: multipart/mixed; boundary="${boundary}"`,
      ``,
      `--${boundary}`,
      `Content-Type: text/html; charset="UTF-8"`,
      `Content-Transfer-Encoding: 7bit`,
      ``,
      htmlContent,
      ``,
      `--${boundary}`,
      `Content-Type: application/pdf; name="ARAZON_RULES.pdf"`,
      `Content-Disposition: attachment; filename="ARAZON_RULES.pdf"`,
      `Content-Transfer-Encoding: base64`,
      ``,
      pdfBase64,
      ``,
      `--${boundary}--`,
    ].join("\r\n");

    const command = new SendRawEmailCommand({
      RawMessage: { Data: Buffer.from(rawMessage) },
    });

    const result = await sesClient.send(command);
    console.log(`✅ Email sent to ${to}. MessageId: ${result.MessageId}`);
    return { success: true };
  } catch (err: any) {
    console.error("❌ SES FATAL ERROR:", err.message);
    return { success: false, error: err.message };
  }
}
