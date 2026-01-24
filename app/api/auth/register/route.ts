import { NextResponse } from "next/server";
import bcrypt from "bcryptjs";
import { connect } from "@/dbconfig/db";
import User from "@/models/team.model";

export async function POST(req: Request) {
  try {
    await connect();

    const { name, email, phone, college, department, password } =
      await req.json();

    if (!name || !email || !phone || !college || !department || !password) {
      return NextResponse.json(
        { message: "All fields are required" },
        { status: 400 },
      );
    }

    // check existing email
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return NextResponse.json(
        { message: "Email already registered" },
        { status: 409 },
      );
    }

    // 🔥 GET LAST TEAM
    const lastTeam = await User.findOne({})
      .sort({ createdAt: -1 })
      .select("teamId");

    let nextNumber = 101;

    if (lastTeam?.teamId) {
      const lastNumber = parseInt(lastTeam.teamId.split("-")[1]);
      nextNumber = lastNumber + 1;
    }

    const teamId = `ARA-${nextNumber}`;

    const hashedPassword = await bcrypt.hash(password, 10);

    const user = await User.create({
      teamId,
      name,
      email,
      phone,
      college,
      department,
      password: hashedPassword,
    });

    return NextResponse.json(
      {
        message: "Registration successful",
        teamId: user.teamId,
      },
      { status: 201 },
    );
  } catch (error) {
    console.error(error);
    return NextResponse.json({ message: "Server error" }, { status: 500 });
  }
}
