"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";

export default function SkincarePage() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isAdmin, setIsAdmin] = useState(false); // 🔑 অ্যাডমিন স্টেট
  const router = useRouter();

  useEffect(() => {
    // ১. ইউজার অ্যাডমিন কি না চেক করা
    async function checkAdminStatus() {
      try {
        const res = await fetch("/api/me");
        if (res.ok) {
          const data = await res.json();
          if (data?.customer?.role === "admin") {
            setIsAdmin(true);
          }
        }
      } catch (error) {
        console.error("Admin check failed:", error);
      }
    }

    // ২. স্কিনকেয়ার প্রোডাক্ট লোড করা
    async function fetchProducts() {
      try {
        const res = await fetch("/api/products?category=haircare");
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

    checkAdminStatus();
    fetchProducts();
  }, []);

  // 🗑️ প্রোডাক্ট ডিলিট করার হ্যান্ডলার (শুধুমাত্র অ্যাডমিনদের জন্য)
  const handleDelete = async (e, id) => {
    e.preventDefault();
    e.stopPropagation();

    if (!confirm("Are you sure you want to delete this product?")) return;

    try {
      const res = await fetch(`/api/products/${id}`, {
        method: "DELETE",
      });
      const data = await res.json();

      if (res.ok && data.success) {
        setProducts((prev) => prev.filter((item) => item._id !== id));
        alert("Product deleted successfully!");
      } else {
        alert(data.message || "Failed to delete product.");
      }
    } catch (error) {
      console.error("Delete error:", error);
      alert("Error deleting product.");
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
        haircare Collection
      </h1>

      {loading ? (
        <div className="flex justify-center items-center py-20">
          <h2 className="text-xl font-bold text-amber-950 animate-pulse">
            Loading haircare Products...
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
                href={`/haircare/${item._id}`}
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

                    {/* 🔐 শুধুমাত্র অ্যাডমিন হলেই এডিট ও ডিলিট বাটন দেখাবে */}
                    {isAdmin && (
                      <div className="absolute top-2 right-2 flex gap-2 z-10">
                        <button
                          type="button"
                          onClick={(e) => {
                            e.preventDefault();
                            e.stopPropagation();
                            router.push(`/secretdashboard/edit-product/${item._id}`);
                          }}
                          className="bg-blue-600 text-white p-1.5 rounded-md hover:bg-blue-700 transition text-xs font-bold shadow-md"
                          title="Edit Product"
                        >
                          ✏️ Edit
                        </button>

                        <button
                          type="button"
                          onClick={(e) => handleDelete(e, item._id)}
                          className="bg-red-600 text-white p-1.5 rounded-md hover:bg-red-700 transition text-xs font-bold shadow-md"
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