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
  const subject = "💳 Payment Verified - GLITCH FIX Registration";
  const boundary = `----=_Part_${Math.random().toString(36).substring(2)}`;

  try {
    const filePath = path.join(process.cwd(), "public", "ARAZON_RULES.pdf");

    // Check if file exists before reading
    if (!fs.existsSync(filePath)) {
      throw new Error(`FILE_NOT_FOUND: ${filePath}`);
    }

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
      `<h2>Payment Successful ✅</h2><p>Hello ${name}, your payment for Team ${teamId} is confirmed.</p>`,
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
