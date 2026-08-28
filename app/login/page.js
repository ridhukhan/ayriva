"use client"
import Link from "next/link"
import { useState } from "react"
import { toast } from "sonner"
export default function Login(){
const [email,setEmail]=useState("")
const [password,setPassword]=useState("")
const [loading,setLoading]=useState(false)

const handleform =async (e)=>{
    e.preventDefault()
    try {
    setLoading(true)

    const res = await fetch("/api/login",{
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({  email, password }),
    });

    const data = await res.json();

    if (!res.ok) {
      toast.error(data.message || "login failed");
      setLoading(false);
      return;
    }

    // Success Block
    toast.success(data.message || "login SuccessFully");
    setLoading(false);
    router.push("/");
    
    } catch (error) {
        console.error("Fetch Error:", error);
    // যদি catch ব্লক ফায়ার করে তবে আসল error message কনসোলে দেখাবে
    toast.error("Network error: " + error.message);
    setLoading(false);
    }
}
    return(

        <div className="min-h-screen w-full bg-amber-50 flex flex-col justify-center items-center p-4">

           <h1 className="text-5xl font-extrabold mt-5">Login plz</h1>

            <form className="bg-amber-950 h-100 mx-35 rounded-2xl flex flex-col 
            justify-center gap-5 mt-17" onSubmit={handleform}>
             <input type="email" placeholder="enter ur Email" 
             value={email}
             onChange={(e)=>setEmail(e.target.value)}
             className="bg-white mx-16 py-2 rounded-2xl text-center border-4 font-bold border-solid border-amber-600"/>
             <input type="password" placeholder="enter ur Password" 
              value={password}
             onChange={(e)=>setPassword(e.target.value)}
             className="bg-white mx-16 py-2 rounded-2xl text-center border-4 font-bold border-solid border-amber-600"/>

             
<button 
type="submit"
className="bg-yellow-600 mx-32 py-2 rounded-2xl shadow-[4px_10px_19px_#000]" disabled={loading}>{loading?"loading..":"Login"}</button>
<div className="flex justify-center"><p>u haven't any account? </p>
<Link href={"/register"}><span className="text-amber-500 decoration-2 decoration-amber-600 underline">Register now</span></Link> 
</div>
            </form>
        </div>
    )
}