import jwt from "jsonwebtoken";
import { NextResponse } from "next/server";

export async function GET(req) {
  try {
    // ১. প্রথমে ব্রাউজার Cookie চেক করবে (ওয়েবসাইটের জন্য)
    let token = req.cookies.get("token")?.value;

    // ২. যদি Cookie না থাকে, তবে Authorization Header চেক করবে (মোবাইল অ্যাপের জন্য)
    if (!token) {
      const authHeader = req.headers.get("authorization");
      if (authHeader && authHeader.startsWith("Bearer ")) {
        token = authHeader.split(" ")[1];
      }
    }

    // টোকেন না থাকলে Unauthorized (401) রিটার্ন করবে
    if (!token) {
      return NextResponse.json(
        { customer: null },
        { status: 401 }
      );
    }

    // টোকেন ভেরিফাই করা
    const decoded = jwt.verify(token, process.env.SECRET_KEY);

    return NextResponse.json(
      { customer: decoded },
      { status: 200 }
    );
  } catch (error) {
    return NextResponse.json(
      { customer: null },
      { status: 400 }
    );
  }
}