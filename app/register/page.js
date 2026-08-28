"use client"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { useState } from "react"
import { toast } from "sonner"
export default function Register(){
const [username,setUsername]=useState("")
const [email,setEmail]=useState("")
const [password,setPassword]=useState("")
const [loading,setLoading] = useState(false)
const router=useRouter()
const handleForm = async (e) => {
  e.preventDefault();
  setLoading(true);

  try {
    const res = await fetch("/api/register", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ username, email, password }),
    });

    const data = await res.json();

    if (!res.ok) {
      toast.error(data.message || "Registration failed");
      setLoading(false);
      return;
    }

    // Success Block
    toast.success(data.message || "User created successfully!");
    setLoading(false);
    router.push("/login");
    
  } catch (error) {
    console.error("Fetch Error:", error);
    // যদি catch ব্লক ফায়ার করে তবে আসল error message কনসোলে দেখাবে
    toast.eror("Network error: " + error.message);
    setLoading(false);
  }
};
 return(

        <div className="justify-center bg-amber-50 h-screen w-full items-center text-center">

            <h1 className="text-5xl font-extrabold mt-5">Register plz</h1>

            <form onSubmit={handleForm} className="bg-amber-950 h-100 mx-35 rounded-2xl flex flex-col 
            justify-center gap-5 mt-17">
             <input type="text"
             value={username}
             onChange={(e)=>setUsername(e.target.value)}
             placeholder="enter ur name" className="bg-white mx-16 py-2 rounded-2xl text-center border-4 font-bold border-solid border-amber-600"/>
             <input type="email" 
             value={email}
             onChange={(e)=>setEmail(e.target.value)}
             
             placeholder="enter ur Email" className="bg-white mx-16 py-2 rounded-2xl text-center border-4 font-bold border-solid border-amber-600"/>
             <input type="password" placeholder="enter ur Password" 
             value={password}
             onChange={(e)=>setPassword(e.target.value)}
             className="bg-white mx-16 py-2 rounded-2xl text-center border-4 font-bold border-solid border-amber-600"/>

             
<button type="submit" disabled={loading} className="bg-yellow-600 mx-32 py-2 rounded-2xl shadow-[4px_10px_19px_#000]">{loading?"submitting..":"submit"}</button>
<div className="flex justify-center"><p>Already Have account? </p>
<Link href={"/login"}><span className="text-amber-500 decoration-2 decoration-amber-600 underline">Login now</span></Link> 
</div>
</form>
        </div>
    )
}