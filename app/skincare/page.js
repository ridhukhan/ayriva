"use client";

import { useEffect, useState } from "react";
import Link from "next/link";

export default function SkincarePage() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchProducts() {
      try {
        const res = await fetch("/api/products?category=skincare");
        const data = await res.json();

        if (data?.success && Array.isArray(data?.products)) {
          setProducts(data.products);
        }
      } catch (error) {
        console.error("Failed to fetch skincare products:", error);
      } finally {
        setLoading(false);
      }
    }

    fetchProducts();
  }, []);

  return (
    <div className="bg-white min-h-screen p-6 md:p-12 relative">
      {/* Top Left Fixed/Absolute Go Back Button */}
      <Link href={"/"} className="absolute top-4 left-4 z-10">
        <span className="bg-black text-white px-4 py-2 rounded-lg text-sm font-semibold shadow-md hover:bg-gray-800 transition">
          ← Go Back
        </span>
      </Link>

      <h1 className="text-3xl font-bold text-center mb-8 text-black mt-6 md:mt-0">
        Skincare Collection
      </h1>

      {loading ? (
        <div className="flex justify-center items-center py-20">
          <h2 className="text-xl font-bold text-amber-950 animate-pulse">
            Loading Skincare Products...
          </h2>
        </div>
      ) : products.length === 0 ? (
        <p className="text-center text-gray-500 font-semibold py-20">
          No products found. Please upload from Dashboard!
        </p>
      ) : (
        /* প্রোডাক্টের ডায়নামিক গ্রিড লেআউট */
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6 max-w-7xl mx-auto">
          {products.map((item) => {
            const defaultPrice = item.variants?.[0]?.price || 0;

            return (
              <Link
                key={item._id}
                href={`/skincare/${item._id}`}
                className="border border-[#D4AF37] shadow-black shadow-lg rounded-xl p-4 flex flex-col justify-between bg-white cursor-pointer block hover:scale-[1.01] transition-transform"
              >
                <div>
                  {/* ১. মেইন ইমেজ */}
                  <div className="w-full h-48 mb-4 rounded-lg overflow-hidden bg-gray-100">
                    <img
                      src={item.mainImage}
                      alt={item.title}
                      className="w-full h-full object-cover"
                    />
                  </div>

                  {/* ২. ইমেজের নিচে টাইটেল */}
                  <h2 className="text-lg font-bold text-black mb-2 line-clamp-1">
                    {item.title}
                  </h2>

                  {/* ৩. টাইটেলের নিচে ডিফোল্ট প্রাইস */}
                  <p className="text-gray-800 font-extrabold text-xl mb-4">
                    ৳ {defaultPrice}
                  </p>
                </div>

                {/* ৪. প্রাইসের নিচে Buy Now বাটন */}
                <div className="w-full bg-yellow-700 text-black font-bold py-2.5 px-4 rounded-lg hover:bg-yellow-600 transition duration-200 text-center">
                  Buy Now
                </div>
              </Link>
            );
          })}
        </div>
      )}
    </div>
  );
}