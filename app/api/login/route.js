import { NextResponse } from "next/server"
import user from "@/models/users"
import bcrypt from "bcryptjs"
import { dbConnect } from "@/lib/mongodb"
export async function POST(req){

    const {email,password}=await req.json()

try {
    if(!email || !password){
    return NextResponse.json({
        message:"fillup all input "
    },
{status:400})
}
await dbConnect()
const foundUser = await user.findOne({email})
if(!foundUser){
    return NextResponse.json({
        message:"user not found"
    },{
        status:400
    }
)
}
const passwordMatched = await bcrypt.compare(password,foundUser.password)
if(!passwordMatched){
    return NextResponse.json({
        message:"wrong password try again"
    },
{status:400})
}
return NextResponse.json({
    message:"login sucessfully"
},{status:201})
} catch (error) {
    console.error("login server problem")
    return NextResponse.json({
        message:"Tnternal server error "
    },{
        status:500
    })
}
}