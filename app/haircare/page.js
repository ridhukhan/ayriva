"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

export default function HaircarePage() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  // ডাটাবেজ থেকে Skincare ক্যাটাগরির প্রোডাক্ট লোড করার useEffect
  useEffect(() => {
    async function fetchProducts() {
      try {
        const res = await fetch("/api/products?category=haircare");
        const data = await res.json();

        if (data.success) {
          setProducts(data.products);
        }
      } catch (error) {
        console.error("Failed to fetch products:", error);
      } finally {
        setLoading(false);
      }
    }

    fetchProducts();
  }, []);

  if (loading) {
    return (
      <div className="min-h-screen bg-white flex items-center justify-center">
        <h2 className="text-xl font-bold text-black">Loading hair Products...</h2>
      </div>
    );
  }

  return (
    <div className="bg-white min-h-screen p-6 md:p-12">
      <h1 className="text-3xl font-bold text-center mb-8 text-black">
        HairCare Collection
      </h1>

      {products.length === 0 ? (
        <p className="text-center text-gray-500 font-semibold">
          No products found. Please upload from Dashboard!
        </p>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6 max-w-7xl mx-auto">
          {products.map((item) => {
            const defaultPrice = item.variants?.[0]?.price || 0;

            return (
              <div
                key={item._id}
                className="border border-[#D4AF37] shadow-black shadow-lg rounded-xl p-4 flex flex-col justify-between bg-white"
              >
                <div>
                  <div className="w-full h-48 mb-4 rounded-lg overflow-hidden bg-gray-100">
                    <img
                      src={item.mainImage}
                      alt={item.title}
                      className="w-full h-full object-cover"
                    />
                  </div>

                  <h2 className="text-lg font-bold text-black mb-2 line-clamp-1">
                    {item.title}
                  </h2>

                  <p className="text-gray-800 font-extrabold text-xl mb-4">
                    ৳ {defaultPrice}
                  </p>
                </div>

                <button
                  onClick={() => router.push(`/haircare/${item._id}`)}
                  className="w-full bg-yellow-700 text-black font-bold py-2.5 px-4 rounded-lg hover:bg-yellow-600 transition duration-200 cursor-pointer"
                >
                  Buy Now
                </button>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}