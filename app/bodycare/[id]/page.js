"use client";

import Link from "next/link";
import { use, useEffect, useState } from "react";
import { toast } from "sonner";

export default function ProductDetailsPage({ params }) {
  // Next.js-এর async params unwrapping
  const resolvedParams = use(params);
  const id = resolvedParams.id;

  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  
  const [activeImg, setActiveImg] = useState("");
  const [selectedVariant, setSelectedVariant] = useState(null);
  const [quantity, setQuantity] = useState(1);

  // Form States
  const [name, setName] = useState("");
  const [district, setDistrict] = useState("");
  const [policeStation, setPoliceStation] = useState("");
  const [area, setArea] = useState("");
  const [orderSubmitting, setOrderSubmitting] = useState(false);

  // Single Product Fetching Logic
  useEffect(() => {
    async function getProduct() {
      try {
        const res = await fetch(`/api/products/${id}`);
        const data = await res.json();

        if (data.success && data.product) {
          setProduct(data.product);
          setActiveImg(data.product.mainImage);
          // প্রথম সাইজ-প্রাইস টি বাই ডিফল্ট সিলেক্ট থাকবে
          if (data.product.variants && data.product.variants.length > 0) {
            setSelectedVariant(data.product.variants[0]);
          }
        } else {
          toast.error("Product not found!");
        }
      } catch (error) {
        toast.error("Failed to load product details.");
      } finally {
        setLoading(false);
      }
    }

    if (id) getProduct();
  }, [id]);

  if (loading) {
    return (
      <div className="min-h-screen bg-white flex items-center justify-center">
        <h2 className="text-xl font-bold text-black">Loading Details...</h2>
      </div>
    );
  }

  if (!product) {
    return (
      <div className="min-h-screen bg-white flex items-center justify-center">
        <h2 className="text-xl font-bold text-red-600">Product not found!</h2>
      </div>
    );
  }

  // Gallery-র জন্য সব ছবি একটি Array-তে নিয়ে আসা
  const allImages = [product.mainImage, ...(product.subImages || [])].filter(Boolean);

  // Dynamic Total Price Calculation
  const unitPrice = selectedVariant?.price || 0;
  const totalPrice = unitPrice * quantity;

  // Order Submission Logic
  const handleOrderSubmit = async (e) => {
    e.preventDefault();

    if (!selectedVariant) {
      return toast.error("Please select a size variant!");
    }

    setOrderSubmitting(true);

    const orderData = {
      productId: product._id,
      productTitle: product.title,
      selectedSize: selectedVariant.size,
      unitPrice: selectedVariant.price,
      quantity,
      totalPrice,
      name,
      district,
      policeStation,
      area,
    };

    try {
      const res = await fetch("/api/orders", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(orderData),
      });

      const data = await res.json();

      if (data.success) {
        toast.success("Order placed successfully!");
        setName("");
        setDistrict("");
        setPoliceStation("");
        setArea("");
        setQuantity(1);
      } else {
        toast.error(data.message || "Failed to place order.");
      }
    } catch (err) {
      toast.error("Something went wrong while placing the order.");
    } finally {
      setOrderSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-white text-black p-4 md:p-10 flex justify-center items-center">
      <Link href={"/bodycare"}><p className="bg-black text-taupe-100 left-0">go back</p></Link>
      <div className="max-w-2xl w-full border border-[#D4AF37] shadow-black shadow-xl rounded-2xl p-6 md:p-8 bg-white flex flex-col gap-6">
        
        {/* 1. Main Display Image */}
        <div className="w-full h-80 rounded-xl overflow-hidden border border-gray-200">
          <img
            src={activeImg}
            alt={product.title}
            className="w-full h-full object-cover"
          />
        </div>

        {/* Sub Images Thumbnails */}
        {allImages.length > 1 && (
          <div className="flex gap-3 justify-center overflow-x-auto pb-2">
            {allImages.map((imgUrl, i) => (
              <img
                key={i}
                src={imgUrl}
                alt="thumbnail"
                onClick={() => setActiveImg(imgUrl)}
                className={`w-16 h-16 object-cover rounded-lg border-2 cursor-pointer transition ${
                  activeImg === imgUrl ? "border-[#D4AF37] scale-105" : "border-gray-200"
                }`}
              />
            ))}
          </div>
        )}

        {/* 2. Product Information */}
        <div className="text-center flex flex-col gap-2">
          <h1 className="text-2xl md:text-3xl font-extrabold text-black">
            {product.title}
          </h1>
          <p className="text-gray-700 text-sm md:text-base leading-relaxed whitespace-pre-line">
            {product.description}
          </p>
          {product.benefits && (
            <p className="text-xs bg-amber-50 text-amber-900 border border-amber-200 p-2.5 rounded-lg font-semibold mt-1">
              <span className="font-bold">Benefits:</span> {product.benefits}
            </p>
          )}
        </div>

        {/* 3. Dynamic Size / Variant Selection */}
        <div className="flex flex-col items-center gap-2">
          <span className="font-bold text-sm text-gray-800">Select Available Size:</span>
          <div className="flex flex-wrap justify-center gap-2">
            {product.variants?.map((v, i) => (
              <button
                key={i}
                type="button"
                onClick={() => setSelectedVariant(v)}
                className={`px-4 py-2 rounded-xl border text-sm font-bold transition cursor-pointer ${
                  selectedVariant?.size === v.size
                    ? "bg-[#D4AF37] text-black border-[#D4AF37] shadow-md scale-105"
                    : "bg-gray-50 border-gray-300 text-black hover:bg-gray-100"
                }`}
              >
                {v.size} — ৳{v.price}
              </button>
            ))}
          </div>
        </div>

        {/* 4. Quantity Controls and Total Calculation */}
        <div className="flex justify-between items-center bg-gray-50 border border-gray-200 p-4 rounded-xl">
          <div className="flex items-center border border-gray-300 rounded-lg bg-white overflow-hidden">
            <button
              type="button"
              onClick={() => setQuantity((q) => Math.max(1, q - 1))}
              className="px-3 py-1 font-bold text-lg hover:bg-gray-100"
            >
              -
            </button>
            <span className="px-4 font-bold text-black">{quantity}</span>
            <button
              type="button"
              onClick={() => setQuantity((q) => Math.min(10, q + 1))}
              className="px-3 py-1 font-bold text-lg hover:bg-gray-100"
            >
              +
            </button>
          </div>

          <div className="text-right">
            <span className="text-xs text-gray-500 font-bold block">Total Price</span>
            <span className="text-2xl font-black text-green-700">৳ {totalPrice}</span>
          </div>
        </div>

        {/* 5. Checkout Address Form */}
        <form onSubmit={handleOrderSubmit} className="flex flex-col gap-3 border border-[#D4AF37] p-5 rounded-xl bg-amber-50/30">
          <h3 className="font-bold text-center text-lg text-black mb-1">
            Delivery Information
          </h3>

          <input
            type="text"
            placeholder="Your Name"
            value={name}
            onChange={(e) => setName(e.target.value)}
            className="p-2.5 border border-gray-300 rounded-lg bg-white text-black font-medium"
            required
          />

          <input
            type="text"
            placeholder="District (e.g. Dhaka)"
            value={district}
            onChange={(e) => setDistrict(e.target.value)}
            className="p-2.5 border border-gray-300 rounded-lg bg-white text-black font-medium"
            required
          />

          <input
            type="text"
            placeholder="Police Station / Thana"
            value={policeStation}
            onChange={(e) => setPoliceStation(e.target.value)}
            className="p-2.5 border border-gray-300 rounded-lg bg-white text-black font-medium"
            required
          />

          <input
            type="text"
            placeholder="Detailed Area / House Address"
            value={area}
            onChange={(e) => setArea(e.target.value)}
            className="p-2.5 border border-gray-300 rounded-lg bg-white text-black font-medium"
            required
          />

          <button
            type="submit"
            disabled={orderSubmitting}
            className="w-full bg-yellow-700 text-black font-bold py-3 rounded-lg hover:bg-yellow-800 transition duration-200 mt-2 disabled:opacity-50 shadow-md cursor-pointer"
          >
            {orderSubmitting ? "Placing Order..." : "Confirm Order"}
          </button>
        </form>

      </div>
    </div>
  );
}