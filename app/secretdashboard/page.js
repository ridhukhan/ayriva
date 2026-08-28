
"use client"
import { useRouter } from "next/navigation"
import {  useEffect, useState } from "react"

export default function SecretDashboard(){
    const router =useRouter()
const [isadmin , setISadmin]=useState(null)
const [loading,setLoading]=useState(true)
useEffect(()=>{
async function checkAdmin(){
    const res =  await fetch("/api/me")
    const data = await res.json()

    if(data?.customer?.role=== "admin"){
        setISadmin(true)
        setLoading(false)
    }else{
        router.push("/")
    }
}

   checkAdmin()
},[])
if(loading){
   return(<div className="bg-fuchsia-800 font-bold text-3xl text-white">
    <h1>security checking......</h1>
</div>)
}
if(!isadmin)return;
    return(

        <div>

            <h1>hello Admin ,good evening</h1>
        </div>
    )
}