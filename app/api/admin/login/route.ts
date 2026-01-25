// app/api/admin/login/route.ts
import { NextRequest, NextResponse } from "next/server";
import { connect } from "@/dbconfig/db";
import Admin from "@/models/admin.model";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";

export async function POST(req: NextRequest) {
  try {
    await connect();

    const { email, password } = await req.json();

    if (!email || !password) {
      return NextResponse.json(
        { message: "Email and password required" },
        { status: 400 },
      );
    }

    const admin = await Admin.findOne({ email });
    if (!admin) {
      return NextResponse.json(
        { message: "Invalid credentials" },
        { status: 401 },
      );
    }

    const isMatch = await bcrypt.compare(password, admin.password);
    if (!isMatch) {
      return NextResponse.json(
        { message: "Invalid credentials" },
        { status: 401 },
      );
    }

    // ✅ PERFECT TOKEN
    const token = jwt.sign(
      {
        adminId: admin._id.toString(),
        role: "ADMIN",
      },
      process.env.JWT_SECRET!,
      { expiresIn: "1d" },
    );

    return NextResponse.json({ token }, { status: 200 });
  } catch (error) {
    console.error("Admin login error:", error);
    return NextResponse.json(
      { message: "Internal server error" },
      { status: 500 },
    );
  }
}
