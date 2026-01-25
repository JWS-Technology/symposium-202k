import { NextRequest, NextResponse } from "next/server";
import { connect } from "@/dbconfig/db";
import Admin from "@/models/admin.model";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";

export async function POST(req: NextRequest) {
  try {
    await connect();

    const { email, password } = await req.json();

    const admin = await Admin.findOne({ email });
    if (!admin) {
      return NextResponse.json(
        { message: "Invalid credentials" },
        { status: 401 },
      );
    }

    const match = await bcrypt.compare(password, admin.password);
    if (!match) {
      return NextResponse.json(
        { message: "Invalid credentials" },
        { status: 401 },
      );
    }

    const token = jwt.sign(
      { adminId: admin._id, role: "ADMIN" },
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
