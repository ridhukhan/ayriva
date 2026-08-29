import { NextResponse } from "next/server";
import { dbConnect } from "@/lib/mongodb";
import Product from "@/models/Product";

export async function GET(req, { params }) {
  try {
    await dbConnect();
    const { id } = await params;
    const product = await Product.findById(id);

    if (!product) {
      return NextResponse.json({ success: false, message: "Product not found" }, { status: 404 });
    }

    return NextResponse.json({ success: true, product }, { status: 200 });
  } catch (error) {
    return NextResponse.json({ success: false, message: "Invalid ID" }, { status: 400 });
  }
}