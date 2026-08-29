import { NextResponse } from "next/server";
import { dbConnect } from "@/lib/mongodb";
import Order from "@/models/Order";

export async function POST(req) {
  try {
    await dbConnect();
    const body = await req.json();
    
    const newOrder = await Order.create(body);

    return NextResponse.json(
      { 
        success: true, 
        message: "Order placed successfully!", 
        order: newOrder 
      }, 
      { status: 201 }
    );
  } catch (error) {
    return NextResponse.json(
      { success: false, message: error.message }, 
      { status: 500 }
    );
  }
}