"use client";

import Link from "next/link";
import { useEffect, useState } from "react";

export default function Amazon() {
  const [products, setProducts] = useState([]);

  useEffect(() => {
    fetch("/api/products?category=amazon", { cache: "no-store" })
      .then((res) => res.json())
      .then((data) => {
        setProducts(Array.isArray(data?.products) ? data.products : []);
      })
      .catch(() => setProducts([]));
  }, []);

  return (
    <div className="bg-white min-h-screen px-3 py-4 md:p-12">
      <p className="text-center text-xs text-gray-500 mb-4">
        As an Amazon Associate I earn from qualifying purchases.
      </p>

      <h1 className="text-2xl md:text-3xl font-bold text-center mb-6 text-black">
        Amazon Collection
      </h1>

      <div className="grid grid-cols-3 md:grid-cols-4 gap-3 md:gap-6 max-w-7xl mx-auto">
        {products.map((item) => (
          <Link
            key={item._id}
            href={`/amazon/${item._id}`}
            className="block bg-white rounded-xl p-2 md:p-3 shadow-[0_8px_24px_rgba(0,0,0,0.18)] hover:shadow-[0_12px_32px_rgba(0,0,0,0.28)] hover:scale-[1.02] transition"
          >
            <div className="w-full aspect-square rounded-lg overflow-hidden bg-gray-100">
              <img
                src={item.mainImage}
                alt={item.title}
                className="w-full h-full object-cover"
              />
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
}