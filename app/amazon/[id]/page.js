"use client";

import { useState, useEffect, use } from "react";
import { toast } from "sonner";

export default function AmazonProductDetailPage({ params }) {
  const resolvedParams = use(params);
  const id = resolvedParams?.id;

  const [product, setProduct] = useState(null);

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


  const handleCopyLink = () => {
    if (typeof window !== "undefined") {
      navigator.clipboard.writeText(window.location.href);
      toast.success("Product link copied to clipboard!");
    }
  };
  const redirectUrl = product?.affiliateLink || product?.amazonLink || "#";

  return (
    <div className="min-h-screen bg-orange-600 flex flex-col items-center justify-center p-4">
      {/* Amazon Disclosure */}
      <p className="text-center text-xs text-white/90 mb-4 max-w-md">
        As an Amazon Associate I earn from qualifying purchases.
      </p>
 <button
              onClick={handleCopyLink}
              type="button"
              className="bg-amber-100 hover:bg-amber-200 text-amber-950 px-3 py-1.5 rounded-lg text-xs font-bold border border-amber-300 transition shrink-0 flex items-center gap-1"
              title="Copy Product Link"
            >
              📋 Copy Link
            </button>
      {/* Container */}
      <div className="max-w-md w-full bg-white rounded-3xl p-4 shadow-2xl border border-slate-200 flex flex-col items-center">
        {/* Product Main Image */}
        <div className="w-full h-80 md:h-96 rounded-2xl overflow-hidden bg-slate-100 relative border border-slate-100">
          {product?.mainImage && (
            <img
              src={product.mainImage}
              alt={product?.title || "Amazon Product"}
              className="w-full h-full object-cover"
            />
          )}
        </div>

        {/* Button overlapping the bottom of the image */}
        <div className="-mt-7 z-10 w-full px-6">
          <a
            href={redirectUrl}
            target="_blank"
            rel="sponsored nofollow noopener"
            className="w-full bg-amber-500 hover:bg-amber-600 active:scale-95 text-black font-extrabold py-3.5 px-4 rounded-2xl shadow-xl transition-all duration-200 flex items-center justify-center gap-2 text-center text-sm md:text-base border border-amber-400"
          >
            Go to product details ↗
          </a>
        </div>
      </div>
    </div>
  );
}