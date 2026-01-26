import { SESClient, SendEmailCommand } from "@aws-sdk/client-ses";

// 1. Initialize the SES Client (Make sure this is OUTSIDE the function)
const sesClient = new SESClient({
  region: process.env.AWS_REGION || "us-east-1",
  credentials: {
    accessKeyId: process.env.AWS_ACCESS_KEY_ID!,
    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY!,
  },
});

interface PaymentMailParams {
  to: string;
  name: string;
  teamId: string;
  amount: number;
}

export async function sendPaymentSuccessMailSES({
  to,
  name,
  teamId,
  amount,
}: PaymentMailParams) {
  const subject = "💳 Payment Verified - GLITCH FIX Registration";

  // 2. Build Params (Ensure Destination and Source are correct)
  const params = {
    Source: process.env.AWS_SES_SENDER!, // Must be a verified email in AWS SES console
    Destination: {
      ToAddresses: [to], // Must be an array
    },
    Message: {
      Subject: {
        Data: subject,
        Charset: "UTF-8",
      },
      Body: {
        Html: {
          Charset: "UTF-8",
          Data: `
            <div style="font-family: sans-serif; max-width: 600px; border: 1px solid #eee; padding: 20px; border-radius: 12px;">
              <h2 style="color: #059669;">Payment Successful ✅</h2>
              <p>Hello <strong>${name}</strong>,</p>
              <p>We have successfully verified your payment for <strong>Team ${teamId}</strong>.</p>
              <div style="background: #f0fdf4; padding: 15px; border-radius: 8px; border: 1px solid #bbf7d0;">
                <p style="margin: 0; color: #166534;"><strong>Amount Paid:</strong> ₹${amount}</p>
                <p style="margin: 0; color: #166534;"><strong>Status:</strong> CONFIRMED</p>
              </div>
              <p style="margin-top: 20px;">You can now present your registration ID at the venue on <strong>February 6th</strong>.</p>
              <br/>
              <p>Best Regards,<br/><strong>Symposium Core Team</strong></p>
            </div>
          `,
        },
      },
    },
  };

  try {
    // 3. Execute the command
    const command = new SendEmailCommand(params);
    const result = await sesClient.send(command);
    return { success: true, messageId: result.MessageId };
  } catch (err: any) {
    // This will help you see the EXACT reason for failure in your terminal
    console.error("❌ SES Payment Mail Error:", {
      message: err.message,
      code: err.name,
      requestId: err.$metadata?.requestId,
    });
    return { success: false, error: err.message };
  }
}
