import { NextResponse } from "next/server";
import { dbConnect } from "@/lib/mongodb";
import Product from "@/models/Product";

export async function POST(req) {
  try {
    await dbConnect();
    const body = await req.json();
    const newProduct = await Product.create(body);

    return NextResponse.json({ success: true, product: newProduct }, { status: 201 });
  } catch (error) {
    return NextResponse.json({ success: false, message: error.message }, { status: 500 });
  }
}

export async function GET(req) {
  try {
    await dbConnect();
    const { searchParams } = new URL(req.url);
    const category = searchParams.get("category");
    const limit = Number(searchParams.get("limit")) || 0; // limit ধরবে

    let query = {};
    if (category) {
      query.category = category;
    }

    // sort({ createdAt: -1 }) দেওয়া হয়েছে যেন লেটেস্ট আপলোড করা ৪টি প্রোডাক্ট প্রথমে আসে
    const products = await Product.find(query).sort({ createdAt: -1 }).limit(limit);

    return NextResponse.json({ success: true, products }, { status: 200 });
  } catch (error) {
    return NextResponse.json({ success: false, message: error.message }, { status: 500 });
  }
}
