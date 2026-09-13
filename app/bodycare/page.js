"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import useSWR from "swr"; // 🚀 SWR Import

const fetcher = (url) => fetch(url).then((res) => res.json());

export default function SkincarePage() {
  const router = useRouter();

  // 🚀 ১. SWR দিয়ে প্রোডাক্ট ডাটা ফেচিং
  const { data: productData, error: productError, isLoading: productsLoading, mutate } = useSWR(
    "/api/products?category=bodycare",
    fetcher,
    {
      revalidateOnFocus: false,
      dedupingInterval: 300000, // ৫ মিনিট ক্যাশ থাকবে
    }
  );

  // 🚀 ২. SWR দিয়ে অ্যাডমিন স্ট্যাটাস ফেচিং
  const { data: userData } = useSWR("/api/me", fetcher, {
    revalidateOnFocus: false,
  });

  const products = productData?.success && Array.isArray(productData?.products) ? productData.products : [];
  const isAdmin = userData?.customer?.role === "admin";

  // 🗑️ প্রোডাক্ট ডিলিট করার হ্যান্ডলার (Optimistic UI Update সহ)
  const handleDelete = async (e, id) => {
    e.preventDefault();
    e.stopPropagation();

    if (!confirm("Are you sure you want to delete this product?")) return;

    try {
      // SWR Cache থেকে সাথে সাথে রিমুভ করে UI আপডেট করা
      mutate(
        (prev) => ({
          ...prev,
          products: prev.products.filter((item) => item._id !== id),
        }),
        false
      );

      const res = await fetch(`/api/products/${id}`, {
        method: "DELETE",
      });
      const data = await res.json();

      if (res.ok && data.success) {
        alert("Product deleted successfully!");
        mutate(); // ব্যাকএন্ড থেকে নতুন ডাটা দিয়ে রি-সিঙ্ক
      } else {
        alert(data.message || "Failed to delete product.");
        mutate(); // ব্যর্থ হলে পুরানো ডাটা ফেরত আনা
      }
    } catch (error) {
      console.error("Delete error:", error);
      alert("Error deleting product.");
      mutate();
    }
  };

  return (
    <div className="bg-white min-h-screen p-6 md:p-12 relative">
      {/* Go Back Button */}
      <Link href={"/"} className="absolute top-4 left-4 z-10">
        <span className="bg-black text-white px-4 py-2 rounded-lg text-sm font-semibold shadow-md hover:bg-gray-800 transition">
          ← Go Back
        </span>
      </Link>

      <h1 className="text-3xl font-bold text-center mb-8 text-black mt-6 md:mt-0">
        Bodycare Collection
      </h1>

      {productsLoading ? (
        <div className="flex justify-center items-center py-20">
          <h2 className="text-xl font-bold text-amber-950 animate-pulse">
            Loading bodycare Products...
          </h2>
        </div>
      ) : products.length === 0 ? (
        <p className="text-center text-gray-500 font-semibold py-20">
          No products found. Please upload from Dashboard!
        </p>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6 max-w-7xl mx-auto">
          {products.map((item) => {
            const defaultPrice = item.variants?.[0]?.price || 0;

            return (
              <Link
                key={item._id}
                href={`/bodycare/${item._id}`}
                className="border border-[#D4AF37] shadow-black shadow-lg rounded-xl p-4 flex flex-col justify-between bg-white cursor-pointer block hover:scale-[1.01] transition-transform relative group"
              >
                <div>
                  {/* ১. মেইন ইমেজ */}
                  <div className="w-full h-48 mb-4 rounded-lg overflow-hidden bg-gray-100 relative">
                    <img
                      src={item.mainImage}
                      alt={item.title}
                      className="w-full h-full object-cover"
                    />

                    {/* 🔐 অ্যাডমিনদের জন্য এডিট ও ডিলিট বাটন */}
                    {isAdmin && (
                      <div className="absolute top-2 right-2 flex gap-2 z-10">
                        <button
                          type="button"
                          onClick={(e) => {
                            e.preventDefault();
                            e.stopPropagation();
                            router.push(`/secretdashboard/edit-product/${item._id}`);
                          }}
                          className="bg-blue-600 text-white p-1.5 rounded-md hover:bg-blue-700 transition text-xs font-bold shadow-md cursor-pointer"
                          title="Edit Product"
                        >
                          ✏️ Edit
                        </button>

                        <button
                          type="button"
                          onClick={(e) => handleDelete(e, item._id)}
                          className="bg-red-600 text-white p-1.5 rounded-md hover:bg-red-700 transition text-xs font-bold shadow-md cursor-pointer"
                          title="Delete Product"
                        >
                          🗑️ Delete
                        </button>
                      </div>
                    )}
                  </div>

                  {/* ২. টাইটেল */}
                  <h2 className="text-lg font-bold text-black mb-2 line-clamp-1">
                    {item.title}
                  </h2>

                  {/* ৩. প্রাইস */}
                  <p className="text-gray-800 font-extrabold text-xl mb-4">
                    ৳ {defaultPrice}
                  </p>
                </div>

                {/* ৪. Buy Now বাটন */}
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