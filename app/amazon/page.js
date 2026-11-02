"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import useSWR, { mutate } from "swr";

const fetcher = (url) => fetch(url).then((res) => res.json());

export default function Amazon() {
  const router = useRouter();

  const { data: meData } = useSWR("/api/me", fetcher, {
    revalidateOnFocus: false,
    dedupingInterval: 600000, 
  });
  const isAdmin = meData?.customer?.role === "admin";

  const { data: productsData, isLoading } = useSWR(
    "/api/products?category=skincare",
    fetcher,
    {
      revalidateOnFocus: false,
      dedupingInterval: 600000,
    }
  );

  const products = Array.isArray(productsData?.products)
    ? productsData.products
    : [];

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
        mutate(
          "/api/products?category=amazon",
          {
            ...productsData,
            products: products.filter((item) => item._id !== id),
          },
          false
        );
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
     

      <h1 className="text-3xl font-bold text-center mb-8 text-black mt-6 md:mt-0">
        Amazon Collection
      </h1>

      {isLoading ? (
        <div className="flex justify-center items-center py-20">
          <h2 className="text-xl font-bold text-amber-950 animate-pulse">
            Loading Products...
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
                href={`/amazon/${item._id}`}
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
                            router.push(
                              `/secretdashboard/edit-product/${item._id}`
                            );
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

                  

                  
                </div>

               
              </Link>
            );
          })}
        </div>
      )}
    </div>
  );
}