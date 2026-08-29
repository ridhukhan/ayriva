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

    const filter = category ? { category } : {};
    const products = await Product.find(filter);

    return NextResponse.json({ success: true, products }, { status: 200 });
  } catch (error) {
    return NextResponse.json({ success: false, message: error.message }, { status: 500 });
  }
}