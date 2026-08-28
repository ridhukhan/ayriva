import { NextResponse } from "next/server"
import user from "@/models/users"
import bcrypt from "bcryptjs"
import { dbConnect } from "@/lib/mongodb"
import jwt from "jsonwebtoken"
export async function POST(req){


try {
    const {email,password}=await req.json()

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



const tokenData= {
    id:foundUser._id,
    username:foundUser.username,
    email:foundUser.email,
    role:foundUser.role
}
const secretKey=process.env.SECRET_KEY
const token = jwt.sign(
    tokenData,secretKey,{expiresIn:"3d"}
)

const response = NextResponse.json({
    success:true,
    message:"login successfuly",
    customer:{
        id:foundUser._id,
        username:foundUser.username,
        email:foundUser.email,
        role:foundUser.role
    }


},{status:200})
response.cookies.set("token",token,{
    httpOnly:true,
    secure:true,
sameSite:"strict",
maxAge:3*24*60*60,
path:"/",

},
)
return response;
} catch (error) {
    console.error("login server problem")
    return NextResponse.json({
        message:"Tnternal server error "
    },{
        status:500
    })
}
}