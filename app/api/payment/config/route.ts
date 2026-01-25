// api/payment/config/route.ts
import { NextResponse } from "next/server";
import PaymentConfig from "@/models/PaymentConfig";
import { connect } from "@/dbconfig/db";

export async function GET() {
  await connect();
  const config = await PaymentConfig.findOne({ active: true });
  return NextResponse.json({ config });
}
