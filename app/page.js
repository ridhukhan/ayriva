import Link from "next/link";
export default function Home() {
  return (
    <div className="bg-amber-50 h-screen justify-center  w-full">
      <nav className="bg-amber-950 
      items-center justify-between flex
      h-18 w-full top-2 ">
<div className="">
  <img 
className="w-30 h-10 ml-2 justify-center top-2 rounded-3xl shadow-[3px_7px_15px_#000]"
src="https://res.cloudinary.com/dfzaefrkt/image/upload/v1787719042/IMG_20260826_100801.jpg_qxlefw.jpg"/>
</div>
<div>
  <Link href={"/register"}><button className="bg-slate-400 p-2 px-8 
  
  rounded-3xl shadow-[3px_7px_15px_#000]">Login</button></Link>
</div>
      </nav>
    </div>
  );
}
