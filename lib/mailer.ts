import nodemailer from "nodemailer";

export const transporter = nodemailer.createTransport({
  host: process.env.EMAIL_HOST,
  port: Number(process.env.EMAIL_PORT),
  secure: false, // must be false for port 587
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,
  },
});

export async function sendPaymentSuccessMail({
  to,
  name,
  teamId,
  amount,
  role,
}: {
  to: string;
  name: string;
  teamId: string;
  amount: number;
  role: "PARTICIPANT" | "TEAM";
}) {
  await transporter.sendMail({
    from: process.env.EMAIL_FROM,
    to,
    subject: "Payment Confirmed – Symposium Registration",
    html: `
      <h2>Payment Successful ✅</h2>
      <p>Hello <b>${name}</b>,</p>
      <p>Your payment of <b>₹${amount}</b> for <b>Team ${teamId}</b> has been verified.</p>
      <p>Status: <b>CONFIRMED</b></p>
      <br/>
      <p>– Symposium Team</p>
    `,
  });
}
