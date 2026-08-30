"use client";

import useSWR from "swr";
import { useRouter } from "next/navigation";
import Link from "next/link";

// SWR-এর জন্য ফেচার ফাংশন
const fetcher = (url) => fetch(url).then((res) => res.json());

export default function SkincarePage() {
  const router = useRouter();

  // SWR দিয়ে ডাটা ফেচিং ও ক্যাশিং (১০ সেকেন্ডের মধ্যে রিপিটেড ফেচ হবে না)
  const { data, error, isLoading } = useSWR("/api/products?category=skincare", fetcher, {
    revalidateOnFocus: false,
    dedupingInterval: 10000,
  });

  const products = data?.success ? data.products : [];

  if (isLoading) {
    return (
      <div className="min-h-screen bg-white flex items-center justify-center">
        <h2 className="text-xl font-bold text-black">Loading Skincare Products...</h2>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-white flex items-center justify-center">
        <h2 className="text-xl font-bold text-red-600">Failed to load products.</h2>
      </div>
    );
  }

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

      {products.length === 0 ? (
        <p className="text-center text-gray-500 font-semibold">
          No products found. Please upload from Dashboard!
        </p>
      ) : (
        /* প্রোডাক্টের ডায়নামিক গ্রিড লেআউট */
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6 max-w-7xl mx-auto">
          {products.map((item) => {
            const defaultPrice = item.variants?.[0]?.price || 0;

            return (
              <div
                key={item._id}
                onClick={() => router.push(`/skincare/${item._id}`)}
                className="border border-[#D4AF37] shadow-black shadow-lg rounded-xl p-4 flex flex-col justify-between bg-white cursor-pointer"
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
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    router.push(`/skincare/${item._id}`);
                  }}
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