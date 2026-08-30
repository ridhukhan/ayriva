import { NextResponse } from "next/server";
import { dbConnect } from "@/lib/mongodb";
import Order from "@/models/Order";

// 1. POST: নতুন অর্ডার তৈরি করা
export async function POST(req) {
  try {
    await dbConnect();
    const body = await req.json();

    // নির্দিষ্ট ফিল্ড ভ্যালিডেট বা ডিসট্রাকচার করা (Mass Assignment সিকিউরিটির জন্য)
    const {
      productId,
      productTitle,
      selectedSize,
      unitPrice,
      quantity,
      totalPrice,
      name,
      phone,
      district,
      policeStation,
      area,
    } = body;

    const newOrder = await Order.create({
      productId,
      productTitle,
      selectedSize,
      unitPrice,
      quantity,
      totalPrice,
      name,
      phone,
      district,
      policeStation,
      area,
    });

    return NextResponse.json(
      {
        success: true,
        message: "Order placed successfully!",
        order: newOrder,
      },
      { status: 201 }
    );
  } catch (error) {
    console.error("POST Order Error:", error);
    return NextResponse.json(
      { success: false, message: error.message || "Failed to place order." },
      { status: 500 }
    );
  }
}

// 2. GET: ড্যাশবোর্ডের জন্য সকল অর্ডার নিয়ে আসা (যাতে 405 Error না আসে)
export async function GET() {
  try {
    await dbConnect();

    const orders = await Order.find({}).sort({ createdAt: -1 }).lean();

    return NextResponse.json(
      { success: true, orders },
      {
        headers: {
          "Cache-Control": "no-store, max-age=0",
        },
      }
    );
  } catch (error) {
    console.error("GET Order Error:", error);
    return NextResponse.json(
      { success: false, message: "Error fetching orders." },
      { status: 500 }
    );
  }
}