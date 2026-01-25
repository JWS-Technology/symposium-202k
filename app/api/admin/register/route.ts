import { NextRequest, NextResponse } from "next/server";
import { connect } from "@/dbconfig/db";
import Admin from "@/models/admin.model";
import bcrypt from "bcryptjs";

export async function POST(req: NextRequest) {
  try {
    await connect();

    const { email, password } = await req.json();

    if (!email || !password) {
      return NextResponse.json(
        { message: "Email and password are required" },
        { status: 400 },
      );
    }

    const exists = await Admin.findOne({ email });
    if (exists) {
      return NextResponse.json(
        { message: "Admin already exists" },
        { status: 409 },
      );
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    await Admin.create({
      email,
      password: hashedPassword,
    });

    return NextResponse.json(
      { message: "Admin registered successfully" },
      { status: 201 },
    );
  } catch (error) {
    console.error("Admin register error:", error);
    return NextResponse.json(
      { message: "Internal server error" },
      { status: 500 },
    );
  }
}
