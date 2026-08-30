"use client";

import { useEffect, useState, use } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { toast } from "sonner";

export default function EditProductPage({ params }) {
  const router = useRouter();
  const resolvedParams = use(params);
  const id = resolvedParams.id;

  const [loading, setLoading] = useState(true);
  const [updating, setUpdating] = useState(false);

  // Product Form States
  const [title, setTitle] = useState("");
  const [category, setCategory] = useState("skincare");
  const [description, setDescription] = useState("");
  const [benefits, setBenefits] = useState("");
  const [mainImage, setMainImage] = useState("");
  const [subImages, setSubImages] = useState(["", "", "", ""]);
  const [variants, setVariants] = useState([{ size: "", price: "" }]);

  // ১. আগের ডাটা লোড করা
  useEffect(() => {
    async function fetchProduct() {
      try {
        const res = await fetch(`/api/products/${id}`);
        const data = await res.json();

        if (data?.success && data?.product) {
          const p = data.product;
          setTitle(p.title || "");
          setCategory(p.category || "skincare");
          setDescription(p.description || "");
          setBenefits(p.benefits || "");
          setMainImage(p.mainImage || "");
          
          // সাব-ইমেজ সেট করা (সর্বোচ্চ ৪টি)
          const subs = p.subImages || p.galleryImages || [];
          setSubImages([
            subs[0] || "",
            subs[1] || "",
            subs[2] || "",
            subs[3] || "",
          ]);

          setVariants(
            p.variants?.length > 0
              ? p.variants
              : [{ size: "Default", price: 0 }]
          );
        } else {
          toast.error("Product not found!");
        }
      } catch (error) {
        console.error("Fetch error:", error);
        toast.error("Failed to load product details.");
      } finally {
        setLoading(false);
      }
    }

    if (id) fetchProduct();
  }, [id]);

  // ভেরিয়েন্ট ইনপুট হ্যান্ডলার
  const handleVariantChange = (index, field, value) => {
    const updated = [...variants];
    updated[index][field] = value;
    setVariants(updated);
  };

  const addVariant = () => {
    setVariants([...variants, { size: "", price: "" }]);
  };

  const removeVariant = (index) => {
    if (variants.length === 1) return;
    setVariants(variants.filter((_, i) => i !== index));
  };

  // সাব-ইমেজ ইনপুট হ্যান্ডলার
  const handleSubImageChange = (index, value) => {
    const updated = [...subImages];
    updated[index] = value;
    setSubImages(updated);
  };

  // ২. ডাটা আপডেট করা (Submit Handler)
  const handleSubmit = async (e) => {
    e.preventDefault();
    setUpdating(true);

    try {
      const updatedProduct = {
        title,
        category,
        description,
        benefits,
        mainImage,
        subImages: subImages.filter((img) => img.trim() !== ""),
        variants: variants.map((v) => ({
          size: v.size,
          price: Number(v.price),
        })),
      };

      const res = await fetch(`/api/products/${id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(updatedProduct),
      });

      const data = await res.json();

      if (res.ok && data.success) {
        toast.success("Product updated successfully!");
        router.push("/skincare");
      } else {
        toast.error(data.message || "Failed to update product.");
      }
    } catch (error) {
      console.error("Update error:", error);
      toast.error("Error updating product.");
    } finally {
      setUpdating(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-amber-50 flex items-center justify-center">
        <h2 className="text-xl font-bold text-amber-950 animate-pulse">
          Loading Product Data...
        </h2>
      </div>
    );
  }

  return (
    <div className="bg-amber-50 min-h-screen p-4 md:p-8 flex justify-center">
      <div className="max-w-3xl w-full bg-white rounded-2xl p-6 shadow-xl border border-[#D4AF37]">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-2xl font-bold text-amber-950">Edit Product</h1>
          <Link
            href="/skincare"
            className="bg-black text-white px-4 py-2 rounded-lg text-sm font-bold"
          >
            Cancel
          </Link>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Title */}
          <div>
            <label className="block text-sm font-bold text-gray-700 mb-1">
              Product Title
            </label>
            <input
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="w-full p-3 border border-gray-300 rounded-xl text-black font-medium"
              required
            />
          </div>

          {/* Category */}
          <div>
            <label className="block text-sm font-bold text-gray-700 mb-1">
              Category
            </label>
            <select
              value={category}
              onChange={(e) => setCategory(e.target.value)}
              className="w-full p-3 border border-gray-300 rounded-xl text-black font-medium bg-white"
            >
              <option value="skincare">Skincare</option>
              <option value="haircare">Hair Care</option>
              <option value="bodycare">Body Care</option>
              <option value="makeup">Makeup</option>
            </select>
          </div>

          {/* Description */}
          <div>
            <label className="block text-sm font-bold text-gray-700 mb-1">
              Description
            </label>
            <textarea
              rows={3}
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              className="w-full p-3 border border-gray-300 rounded-xl text-black font-medium"
              required
            />
          </div>

          {/* Benefits */}
          <div>
            <label className="block text-sm font-bold text-gray-700 mb-1">
              Benefits
            </label>
            <textarea
              rows={2}
              value={benefits}
              onChange={(e) => setBenefits(e.target.value)}
              className="w-full p-3 border border-gray-300 rounded-xl text-black font-medium"
            />
          </div>

          {/* Main Image URL */}
          <div>
            <label className="block text-sm font-bold text-gray-700 mb-1">
              Main Image URL
            </label>
            <input
              type="url"
              value={mainImage}
              onChange={(e) => setMainImage(e.target.value)}
              className="w-full p-3 border border-gray-300 rounded-xl text-black font-medium"
              required
            />
          </div>

          {/* Sub Images / Gallery URLs */}
          <div>
            <label className="block text-sm font-bold text-gray-700 mb-1">
              Gallery / Sub Images (Up to 4)
            </label>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
              {subImages.map((url, idx) => (
                <input
                  key={idx}
                  type="url"
                  placeholder={`Image URL ${idx + 1}`}
                  value={url}
                  onChange={(e) => handleSubImageChange(idx, e.target.value)}
                  className="p-2.5 border border-gray-300 rounded-lg text-black text-sm"
                />
              ))}
            </div>
          </div>

          {/* Variants & Pricing */}
          <div>
            <label className="block text-sm font-bold text-gray-700 mb-2">
              Variants (Size & Price)
            </label>
            {variants.map((v, idx) => (
              <div key={idx} className="flex gap-2 mb-2 items-center">
                <input
                  type="text"
                  placeholder="Size (e.g. 50ml)"
                  value={v.size}
                  onChange={(e) =>
                    handleVariantChange(idx, "size", e.target.value)
                  }
                  className="w-1/2 p-2.5 border border-gray-300 rounded-lg text-black text-sm"
                  required
                />
                <input
                  type="number"
                  placeholder="Price (৳)"
                  value={v.price}
                  onChange={(e) =>
                    handleVariantChange(idx, "price", e.target.value)
                  }
                  className="w-1/2 p-2.5 border border-gray-300 rounded-lg text-black text-sm"
                  required
                />
                {variants.length > 1 && (
                  <button
                    type="button"
                    onClick={() => removeVariant(idx)}
                    className="bg-red-500 text-white px-3 py-2 rounded-lg text-xs font-bold"
                  >
                    X
                  </button>
                )}
              </div>
            ))}
            <button
              type="button"
              onClick={addVariant}
              className="mt-1 text-xs font-bold text-amber-900 underline"
            >
              + Add More Variant
            </button>
          </div>

          {/* Submit Button */}
          <button
            type="submit"
            disabled={updating}
            className="w-full bg-amber-950 text-white font-bold py-3.5 rounded-xl hover:bg-amber-900 transition shadow-lg text-base cursor-pointer mt-4 disabled:opacity-50"
          >
            {updating ? "Updating Product..." : "Save Changes"}
          </button>
        </form>
      </div>
    </div>
  );
}