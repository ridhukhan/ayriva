import { dbConnect } from "@/lib/mongodb";
import { NextResponse } from "next/server";
import user from "@/models/users";
import bcrypt from "bcryptjs";

export async function POST(req) {
  try {
    const { username, email, password } = await req.json();

    if (!username || !email || !password) {
      return NextResponse.json(
        { message: "Please fill every input" },
        { status: 400 }
      );
    }

    // পাসওয়ার্ড ঠিক ৮ ক্যারেক্টার হতে হবে
    if (password.length !== 8) {
      return NextResponse.json(
        { message: "Password must be exactly 8 characters" },
        { status: 400 }
      );
    }

    await dbConnect();

    const existingUser = await user.findOne({ email });
    if (existingUser) {
      return NextResponse.json(
        { message: "User already taken" },
        { status: 400 }
      );
    }

    const hashedPass = await bcrypt.hash(password, 10);
    await user.create({
      username,
      email,
      password: hashedPass,
    });

    return NextResponse.json(
      { message: "User created successfully done" },
      { status: 201 }
    );
  } catch (error) {
    return NextResponse.json(
      { message: error.message || "Internal server error" },
      { status: 500 }
    );
  }
}