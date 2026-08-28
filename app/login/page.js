import Link from "next/link"
export default function Login(){

    return(

        <div className="min-h-screen w-full bg-amber-50 flex flex-col justify-center items-center p-4">

           <h1 className="text-5xl font-extrabold mt-5">Login plz</h1>

            <form className="bg-amber-950 h-100 mx-35 rounded-2xl flex flex-col 
            justify-center gap-5 mt-17">
             <input type="email" placeholder="enter ur Email" className="bg-white mx-16 py-2 rounded-2xl text-center border-4 font-bold border-solid border-amber-600"/>
             <input type="password" placeholder="enter ur Password" className="bg-white mx-16 py-2 rounded-2xl text-center border-4 font-bold border-solid border-amber-600"/>

             
<button className="bg-yellow-600 mx-32 py-2 rounded-2xl shadow-[4px_10px_19px_#000]">Register</button>
<div className="flex justify-center"><p>u haven't any account? </p>
<Link href={"/register"}><span className="text-amber-500 decoration-2 decoration-amber-600 underline">Register now</span></Link> 
</div>
            </form>
        </div>
    )
}