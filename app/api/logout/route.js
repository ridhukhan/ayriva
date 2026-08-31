import { NextResponse } from "next/server";

export function POST(){

    const response= NextResponse.json({
        message:"logout successfully"
    },{status:200})
    response.cookies.delete("token")
    return response
}