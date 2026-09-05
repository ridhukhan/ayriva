"use client";

import { useEffect, useState, use } from "react";
import Link from "next/link";
import { toast } from "sonner";
import ProductInfo from "@/app/components/Productinfo";
export default function ProductDetailPage({ params }) {
  const resolvedParams = use(params);
  const id = resolvedParams.id;
 const [showpopup ,setSowpopup]=useState(false) 
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [selectedVariant, setSelectedVariant] = useState(null);
  const [quantity, setQuantity] = useState(1);
  const [activeImage, setActiveImage] = useState(""); // 📸 কারেন্ট মেইন ইমেজ দেখানোর জন্য State

  // Order Form States
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [district, setDistrict] = useState("");
  const [policeStation, setPoliceStation] = useState("");
  const [area, setArea] = useState("");
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    async function fetchProduct() {
      try {
        const res = await fetch(`/api/products/${id}`);
        const data = await res.json();

        if (data?.success && data?.product) {
          setProduct(data.product);
          setActiveImage(data.product.mainImage); // ডিফোল্ট মেইন ইমেজ সেট করা হলো
          setSelectedVariant(
            data.product.variants?.[0] || { size: "Default", price: 0 }
          );
        }
      } catch (error) {
        console.error("Fetch error:", error);
      } finally {
        setLoading(false);
      }
    }

    if (id) fetchProduct();
  }, [id]);

  // Order Submit Handler
  const handleOrderSubmit = async (e) => {
    e.preventDefault();
    if (!name || !phone || !district || !policeStation || !area) {
      return toast.error("Please fill in all address details!");
    }

    setSubmitting(true);
    try {
      const orderData = {
        productId: product._id,
        productTitle: product.title,
        selectedSize: selectedVariant?.size,
        unitPrice: selectedVariant?.price,
        quantity,
        totalPrice: (selectedVariant?.price || 0) * quantity,
        name,
        phone,
        district,
        policeStation,
        area,
      };

      const res = await fetch("/api/orders", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(orderData),
      });

      const data = await res.json();

      if (res.ok && data.success) {
        toast.success("Order Placed Successfully!");
        setName("");
        setPhone("");
        setDistrict("");
        setPoliceStation("");
        setArea("");
      } else {
        toast.error(data.message || "Failed to place order!");
      }
    } catch (error) {
      toast.error("Error submitting order.");
    } finally {
      setSowpopup(true)

      setSubmitting(false);
    }
  };

  // 🔗 Product Link Copy Handler (Desktop + Mobile Easy Copy)
  const handleCopyLink = () => {
    if (typeof window !== "undefined") {
      navigator.clipboard.writeText(window.location.href);
      toast.success("Product link copied to clipboard!");
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-amber-50 flex items-center justify-center">
        <h2 className="text-xl font-bold text-amber-950 animate-pulse">
          Loading Product Details...
        </h2>
      </div>
    );
  }

  if (!product) {
    return (
      <div className="min-h-screen bg-white flex flex-col items-center justify-center gap-4">
        <h2 className="text-xl font-bold text-red-600">Product not found!</h2>
        <Link
          href="/skincare"
          className="bg-black text-white px-4 py-2 rounded-lg text-sm font-bold"
        >
          Return to Skincare
        </Link>
      </div>
    );
  }

  const totalPrice = (selectedVariant?.price || 0) * quantity;

  // মেইন ইমেজ + সব সাব-ইমেজ একসাথে লিস্ট করা
  const allImages = [
    product.mainImage,
    ...(product.subImages || product.galleryImages || []),
  ].filter(Boolean);

  return (
    <>
      {/* 🚀 Dynamic Meta Tags for WhatsApp & Social Media Sharing */}
      <head>
        <title>{product.title} | Ayriva</title>
        <meta property="og:title" content={product.title} />
        <meta
          property="og:description"
          content={product.description?.slice(0, 150) || "Authentic skincare product from Ayriva."}
        />
        <meta property="og:image" content={product.mainImage} />
        <meta
          property="og:url"
          content={`https://ayriva.netlify.app/skincare/${product._id}`}
        />
        <meta property="og:type" content="website" />
        <meta property="og:site_name" content="Ayriva" />
      </head>

      <div className="bg-amber-50 min-h-screen p-4 md:p-8 flex justify-center">
        <div className="max-w-3xl w-full bg-white rounded-2xl p-4 md:p-6 shadow-xl border border-[#D4AF37]">
          
          {/* Main Display Image */}
          <div className="w-full h-72 md:h-96 rounded-xl overflow-hidden mb-4 bg-gray-100 relative">
            <img
              src={activeImage || product.mainImage}
              alt={product.title}
              className="w-full h-full object-cover transition-all duration-300"
            />
          </div>

          {allImages.length > 1 && (
            <div className="flex gap-3 mb-6 overflow-x-auto pb-2">
              {allImages.map((imgUrl, index) => (
                <button
                  key={index}
                  type="button"
                  onClick={() => setActiveImage(imgUrl)}
                  className={`w-16 h-16 md:w-20 md:h-20 rounded-lg overflow-hidden border-2 transition shrink-0 ${
                    activeImage === imgUrl
                      ? "border-amber-950 scale-105 shadow-md"
                      : "border-gray-200 opacity-70 hover:opacity-100"
                  }`}
                >
                  <img
                    src={imgUrl}
                    alt={`Thumbnail ${index + 1}`}
                    className="w-full h-full object-cover"
                  />
                </button>
              ))}
            </div>
          )}

          {/* Title & Copy Share Link Button */}
          <div className="flex items-start justify-between gap-2 mb-3">
            <h1 className="text-2xl md:text-3xl font-extrabold text-amber-950">
              {product.title}
            </h1>
            <button
              onClick={handleCopyLink}
              type="button"
              className="bg-amber-100 hover:bg-amber-200 text-amber-950 px-3 py-1.5 rounded-lg text-xs font-bold border border-amber-300 transition shrink-0 flex items-center gap-1"
              title="Copy Product Link"
            >
              📋 Copy Link
            </button>
          </div>

          {/* Description */}
          <p className="text-gray-700 text-sm md:text-base leading-relaxed whitespace-pre-line mb-6">
            {product.description}
          </p>

          {/* Benefits (If available) */}
          {product.benefits && (
            <div className="bg-amber-100/60 border border-amber-300 p-4 rounded-xl mb-6">
              <h3 className="font-bold text-amber-950 text-sm mb-1">Benefits:</h3>
              <p className="text-gray-800 text-xs md:text-sm whitespace-pre-line">
                {product.benefits}
              </p>
            </div>
          )}

          {/* Size / Variant Selection */}
          {product.variants && product.variants.length > 0 && (
            <div className="mb-6">
              <h3 className="font-bold text-gray-800 text-sm mb-2">
                Select Available Size:
              </h3>
              <div className="flex flex-wrap gap-3">
                {product.variants.map((v, idx) => (
                  <button
                    key={idx}
                    type="button"
                    onClick={() => setSelectedVariant(v)}
                    className={`px-4 py-2 rounded-xl text-sm font-bold border transition ${
                      selectedVariant?.size === v.size
                        ? "bg-amber-950 text-white border-amber-950"
                        : "bg-gray-100 text-gray-800 border-gray-300 hover:bg-amber-100"
                    }`}
                  >
                    {v.size} — ৳{v.price}
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Quantity and Price */}
          <div className="flex items-center justify-between border-t border-b border-gray-200 py-4 mb-8">
            <div className="flex items-center border border-gray-300 rounded-xl overflow-hidden">
              <button
                type="button"
                onClick={() => setQuantity((q) => Math.max(1, q - 1))}
                className="px-3 py-1 bg-gray-200 text-gray-800 font-bold hover:bg-gray-300 text-lg"
              >
                -
              </button>
              <span className="px-4 font-bold text-black">{quantity}</span>
              <button
                type="button"
                onClick={() => setQuantity((q) => q + 1)}
                className="px-3 py-1 bg-gray-200 text-gray-800 font-bold hover:bg-gray-300 text-lg"
              >
                +
              </button>
            </div>

            <div className="text-right">
              <span className="text-xs text-gray-500 block">Total Price</span>
              <span className="text-2xl font-black text-amber-950">
                ৳{totalPrice}
              </span>
            </div>
          </div>
          <ProductInfo/>
          {/* Order Form */}
          <div className="border border-amber-200 rounded-2xl p-4 md:p-6 bg-amber-50/50">
            <h2 className="text-xl font-bold text-amber-950 mb-4 text-center">
              Checkout / Delivery Information
            </h2>

            <form onSubmit={handleOrderSubmit} className="flex flex-col gap-3">
              <input
                type="text"
                placeholder="Your Full Name"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="p-3 border border-gray-300 rounded-xl text-black font-medium text-sm bg-white"
                required
              />

              <input
                type="tel"
                placeholder="Mobile Phone Number"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                className="p-3 border border-gray-300 rounded-xl text-black font-medium text-sm bg-white"
                required
              />

              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                <input
                  type="text"
                  placeholder="District (জেলা)"
                  value={district}
                  onChange={(e) => setDistrict(e.target.value)}
                  className="p-3 border border-gray-300 rounded-xl text-black font-medium text-sm bg-white"
                  required
                />

                <input
                  type="text"
                  placeholder="Thana / Police Station (থানা)"
                  value={policeStation}
                  onChange={(e) => setPoliceStation(e.target.value)}
                  className="p-3 border border-gray-300 rounded-xl text-black font-medium text-sm bg-white"
                  required
                />
              </div>

              <textarea
                placeholder="Full Delivery Address / Area Details"
                rows={2}
                value={area}
                onChange={(e) => setArea(e.target.value)}
                className="p-3 border border-gray-300 rounded-xl text-black font-medium text-sm bg-white"
                required
              />

              <button
                type="submit"
                disabled={submitting}
                className="w-full bg-yellow-700 text-black font-bold py-3.5 rounded-xl hover:bg-yellow-600 transition shadow-lg text-base cursor-pointer mt-2 disabled:opacity-50"
              >
                {submitting ? "Placing Order..." : `Confirm Order (৳${totalPrice})`}
              </button>
            </form>
          </div>

        </div>
        {showpopup && <div>
          <img src="https://res.cloudinary.com/dfzaefrkt/image/upload/v1788590845/order_confirmed_uasggd.gif" alt="order confirmed success"/>
          
          
          </div>}
      </div>
    </>
  );
}