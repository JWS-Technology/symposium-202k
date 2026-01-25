"use client";

import { useEffect, useState } from "react";
import QRCode from "qrcode";

interface Props {
    teamId: string;
    email: string;
    amount?: number; // optional, fallback to default
}

export default function PaymentQR({ teamId, email, amount }: Props) {
    const [qr, setQr] = useState("");

    // ✅ ENV CONFIG
    const upiId = process.env.NEXT_PUBLIC_UPI_ID!;
    const payeeName = process.env.NEXT_PUBLIC_PAYEE_NAME!;
    const defaultAmount = Number(process.env.NEXT_PUBLIC_DEFAULT_AMOUNT || 0);

    const finalAmount = amount ?? defaultAmount;

    useEffect(() => {
        if (!upiId || !payeeName || !finalAmount) return;

        const note = `TEAM-${teamId} | ${email}`;

        const upiUrl = `upi://pay?pa=${upiId}&pn=${encodeURIComponent(
            payeeName
        )}&am=${finalAmount}&cu=INR&tn=${encodeURIComponent(note)}`;

        QRCode.toDataURL(upiUrl, { width: 300, margin: 2 })
            .then(setQr)
            .catch(console.error);
    }, [teamId, email, finalAmount, upiId, payeeName]);

    return (
        <div className="bg-[#050505] border border-red-600/30 rounded-xl p-6 text-center">
            <p className="text-red-600 text-xs font-mono tracking-widest mb-3">
                PAYMENT REQUIRED
            </p>

            {qr ? (
                <img
                    src={qr}
                    alt="UPI Payment QR"
                    className="mx-auto w-44"
                />
            ) : (
                <p className="text-zinc-500 text-xs">Generating QR...</p>
            )}

            <p className="text-xs text-zinc-400 mt-3">
                Scan using GPay / PhonePe / Paytm
            </p>

            <p className="text-white font-bold mt-1">
                Amount: ₹{finalAmount}
            </p>

            <p className="text-[10px] text-zinc-500 mt-2">
                Ref: TEAM-{teamId} | {email}
            </p>
        </div>
    );
}
