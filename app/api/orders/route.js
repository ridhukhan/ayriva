import { NextResponse } from "next/server";
import { dbConnect } from "@/lib/mongodb";
import Order from "@/models/Order";

// 1. POST: নতুন অর্ডার তৈরি করা
export async function POST(req) {
  try {
    await dbConnect();
    const body = await req.json();

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
      { success: true, message: "Order placed successfully!", order: newOrder },
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

// 2. GET: সকল অর্ডার নিয়ে আসা
export async function GET() {
  try {
    await dbConnect();
    const orders = await Order.find({}).sort({ createdAt: -1 }).lean();

    return NextResponse.json(
      { success: true, orders },
      { headers: { "Cache-Control": "no-store, max-age=0" } }
    );
  } catch (error) {
    console.error("GET Order Error:", error);
    return NextResponse.json(
      { success: false, message: "Error fetching orders." },
      { status: 500 }
    );
  }
}

// 3. PATCH: অর্ডারের Status (Pending, Confirm, Return) আপডেট করা (একই ফাইলে)
export async function PATCH(req) {
  try {
    await dbConnect();
    const { id, status } = await req.json();

    if (!id || !["Pending", "Confirm", "Return"].includes(status)) {
      return NextResponse.json(
        { success: false, message: "Invalid input values." },
        { status: 400 }
      );
    }

    const updatedOrder = await Order.findByIdAndUpdate(
      id,
      { status },
      { new: true }
    );

    return NextResponse.json({
      success: true,
      message: "Status updated!",
      order: updatedOrder,
    });
  } catch (error) {
    return NextResponse.json(
      { success: false, message: "Update failed." },
      { status: 500 }
    );
  }
}

// 4. DELETE: অর্ডার মুছে ফেলা / ক্যান্সেল করা (একই ফাইলে)
export async function DELETE(req) {
  try {
    await dbConnect();
    const { searchParams } = new URL(req.url);
    const id = searchParams.get("id");

    if (!id) {
      return NextResponse.json(
        { success: false, message: "Order ID is required." },
        { status: 400 }
      );
    }

    await Order.findByIdAndDelete(id);

    return NextResponse.json({
      success: true,
      message: "Order deleted successfully!",
    });
  } catch (error) {
    return NextResponse.json(
      { success: false, message: "Delete failed." },
      { status: 500 }
    );
  }
}