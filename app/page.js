"use client";
import { CircleUserRound } from "lucide-react";
import Link from "next/link";
import HeroSlider from "./components/hero";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

export default function Home() {
  const router = useRouter();

  // User State
  const [user, setUser] = useState(null);

  // Category Products States
  const [skincareProducts, setSkincareProducts] = useState([]);
  const [bodycareProducts, setBodycareProducts] = useState([]);
  const [haircareProducts, setHaircareProducts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // 1. Check User Context
    async function checkUser() {
      try {
        const res = await fetch("/api/me");
        const data = await res.json();
        if (data.customer) {
          setUser(data.customer);
        }
      } catch (error) {
        console.error("failed to fetch user context");
      }
    }

    // 2. Fetch Category Products from Backend
    async function fetchAllCategoryProducts() {
      try {
        const [skinRes, bodyRes, hairRes] = await Promise.all([
          fetch("/api/products?category=skincare&limit=4"),
          fetch("/api/products?category=bodycare&limit=4"),
          fetch("/api/products?category=haircare&limit=4"),
        ]);

        const skinData = await skinRes.json();
        const bodyData = await bodyRes.json();
        const hairData = await hairRes.json();

        if (skinData.success) setSkincareProducts(skinData.products);
        if (bodyData.success) setBodycareProducts(bodyData.products);
        if (hairData.success) setHaircareProducts(hairData.products);
      } catch (error) {
        console.error("Failed to fetch home products:", error);
      } finally {
        setLoading(false);
      }
    }

    checkUser();
    fetchAllCategoryProducts();
  }, []);

  // reusable product section grid renderer (1 line a 2 ta product)
  const renderProductSection = (title, categoryPath, products) => {
    return (
      <section className="mt-8 px-4 max-w-5xl mx-auto">
        {/* Section Header */}
        <div className="flex justify-between items-center mb-4 border-b border-[#D4AF37] pb-2">
          <h2 className="text-xl md:text-2xl font-bold text-amber-950">
            {title}
          </h2>
          <Link
            href={`/${categoryPath}`}
            className="text-xs md:text-sm font-bold text-yellow-800 hover:underline"
          >
            See All →
          </Link>
        </div>

        {/* Product Grid: 1 line a 2 ta product (grid-cols-2) */}
        {loading ? (
          <p className="text-center py-6 font-bold text-amber-950">
            Loading {title}...
          </p>
        ) : products.length === 0 ? (
          <p className="text-gray-500 text-sm italic">
            No products available.
          </p>
        ) : (
          <div className="grid grid-cols-2 gap-4">
            {products.map((item) => {
              const defaultPrice = item.variants?.[0]?.price || 0;

              return (
                <div
                  key={item._id}
                  className="border border-[#D4AF37] shadow-black shadow-md rounded-xl p-3 md:p-4 flex flex-col justify-between bg-white"
                >
                  <div>
                    {/* Main Image */}
                    <div className="w-full h-36 md:h-48 mb-3 rounded-lg overflow-hidden bg-gray-100">
                      <img
                        src={item.mainImage}
                        alt={item.title}
                        className="w-full h-full object-cover"
                      />
                    </div>

                    {/* Title */}
                    <h3 className="text-sm md:text-base font-bold text-black line-clamp-1 mb-1">
                      {item.title}
                    </h3>

                    {/* Default Price */}
                    <p className="text-gray-900 font-extrabold text-base md:text-lg mb-3">
                      ৳ {defaultPrice}
                    </p>
                  </div>

                  {/* Buy Now Button */}
                  <button
                    onClick={() => router.push(`/${categoryPath}/${item._id}`)}
                    className="w-full bg-yellow-700 text-black font-bold py-2 px-2 md:px-4 text-xs md:text-sm rounded-lg hover:bg-yellow-600 transition cursor-pointer"
                  >
                    Buy Now
                  </button>
                </div>
              );
            })}
          </div>
        )}
      </section>
    );
  };

  return (
    <div className="bg-amber-50 min-h-screen w-full pb-12">
      {/* Navbar */}
      <nav className="bg-amber-950 items-center justify-between flex h-18 w-full top-2 px-4">
        <div>
          <img
            className="w-30 h-10 ml-2 justify-center top-2 rounded-3xl shadow-[3px_7px_15px_#000]"
            src="https://res.cloudinary.com/dfzaefrkt/image/upload/v1787719042/IMG_20260826_100801.jpg_qxlefw.jpg"
            alt="Logo"
          />
        </div>
        <div>
          <Link href={user ? "/profile" : "/register"}>
            <button className="bg-slate-400 p-2 px-8 rounded-3xl shadow-[3px_7px_15px_#000] font-bold text-black">
              {user ? user.username : <CircleUserRound className="w-6 h-6 text-black"/>}
            </button>
          </Link>
        </div>
      </nav>

      {/* Hero Section */}
      <section>
        <HeroSlider />
      </section>

      {/* 1st Section: Skincare */}
      {renderProductSection("Skincare Collection", "skincare", skincareProducts)}

      {/* 2nd Section: Bodycare */}
      {renderProductSection("Bodycare Collection", "bodycare", bodycareProducts)}

      {/* 3rd Section: Haircare */}
      {renderProductSection("Haircare Collection", "haircare", haircareProducts)}
    </div>
  );
}