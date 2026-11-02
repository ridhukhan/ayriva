"use client";

import { useState, useEffect, use } from "react";
import Link from "next/link";

export default function AmazonProductDetailPage({ params }) {
  const resolvedParams = use(params);
  const id = resolvedParams?.id;

  const [product, setProduct] = useState(null);

  // 📦 Amazon Product Fetch without loading state
  useEffect(() => {
    if (!id) return;

    fetch(`/api/products/${id}`, { cache: "no-store" })
      .then((res) => res.json())
      .then((data) => {
        if (data?.product) {
          setProduct(data.product);
        }
      })
      .catch((error) => console.error("Error fetching product:", error));
  }, [id]);

  // ড্যাশবোর্ড থেকে সেট করা affiliateLink/amazonLink অথবা fallback link
  const redirectUrl = product?.affiliateLink || product?.amazonLink || "#";

  return (
    <div className="min-h-screen bg-orange-600 flex flex-col items-center justify-center p-4">
      {/* Container */}
      <div className="max-w-md w-full bg-white rounded-3xl p-4 shadow-2xl border border-slate-200 flex flex-col items-center">
        
        {/* 📸 Product Main Image Container */}
        <div className="w-full h-80 md:h-96 rounded-2xl overflow-hidden bg-slate-100 relative border border-slate-100">
          {product?.mainImage && (
            <img
              src={product.mainImage}
              alt={product?.title || "Amazon Product"}
              className="w-full h-full object-cover"
            />
          )}
        </div>

        {/* 🚀 Button Overlapping the bottom of the image (-mt-7) */}
        <div className="-mt-7 z-10 w-full px-6">
          <a
            href={redirectUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="w-full bg-amber-500 hover:bg-amber-600 active:scale-95 text-black font-extrabold py-3.5 px-4 rounded-2xl shadow-xl transition-all duration-200 flex items-center justify-center gap-2 text-center text-sm md:text-base border border-amber-400"
          >
            Go to product details ↗
          </a>
        </div>

      </div>
    </div>
  );
}