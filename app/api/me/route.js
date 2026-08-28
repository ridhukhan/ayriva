import jwt from "jsonwebtoken"
import { NextResponse } from "next/server";


export async function GET(req){

try {
    const token = req.cookies.get("token")?.value;

    if(!token){
        return NextResponse.json({
            customer:null
        },{status:40})
    }
    const decoded = jwt.verify(token,process.env.SECRET_KEY)
    return NextResponse.json({
        customer:decoded
    },{status:200})
} catch (error) {
     return NextResponse.json({
        customer:null
    },{status:400})
}
}

