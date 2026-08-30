"use client";

import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { toast } from "sonner";

export default function SecretDashboard() {
  const router = useRouter();
  const [isAdmin, setIsAdmin] = useState(false);
  const [loading, setLoading] = useState(true);

  // Form States
  const [category, setCategory] = useState("skincare");
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [benefits, setBenefits] = useState("");

  // Image Upload States
  const [mainImgFile, setMainImgFile] = useState(null);
  const [subImgFiles, setSubImgFiles] = useState([null, null, null, null]);

  // Dynamic Sizes & Prices State
  const [variants, setVariants] = useState([{ size: "", price: "" }]);
  const [submitting, setSubmitting] = useState(false);

  // Admin Check Logic
  useEffect(() => {
    async function checkAdmin() {
      try {
        const res = await fetch("/api/me");
        const data = await res.json();

        if (data?.customer?.role === "admin") {
          setIsAdmin(true);
          setLoading(false);
        } else {
          router.push("/");
        }
      } catch (error) {
        router.push("/");
      }
    }

    checkAdmin();
  }, [router]);

  // Dynamic Variant Handlers
  const addVariantField = () => {
    setVariants([...variants, { size: "", price: "" }]);
  };

  const removeVariantField = (index) => {
    setVariants(variants.filter((_, i) => i !== index));
  };

  const handleVariantChange = (index, field, value) => {
    const updated = [...variants];
    updated[index][field] = value;
    setVariants(updated);
  };

  // Cloudinary Image Upload Function
  const uploadImage = async (file) => {
    if (!file) return "";
    const formData = new FormData();
    formData.append("file", file);
    formData.append(
      "upload_preset",
      process.env.NEXT_PUBLIC_CLOUDINARY_UPLOAD_PRESET
    );

    const cloudName = process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME;
    const res = await fetch(
      `https://api.cloudinary.com/v1_1/${cloudName}/image/upload`,
      {
        method: "POST",
        body: formData,
      }
    );
    const data = await res.json();
    return data.secure_url;
  };

  // Form Submit Handler
  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!mainImgFile) return toast.error("Main image is required!");

    setSubmitting(true);
    try {
      toast.loading("Uploading images...");

      const mainImageUrl = await uploadImage(mainImgFile);
      const subImageUrls = await Promise.all(
        subImgFiles.map((file) => uploadImage(file))
      );

      const productData = {
        category,
        mainImage: mainImageUrl,
        subImages: subImageUrls.filter((url) => url !== ""),
        title,
        description,
        benefits,
        variants: variants
          .filter((v) => v.size.trim() !== "" && v.price !== "")
          .map((v) => ({ size: v.size, price: Number(v.price) })),
      };

      toast.loading("Saving product to database...");
      const res = await fetch("/api/products", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(productData),
      });

      toast.dismiss();

      if (res.ok) {
        toast.success("Product Uploaded Successfully!");
        setTitle("");
        setDescription("");
        setBenefits("");
        setMainImgFile(null);
        setSubImgFiles([null, null, null, null]);
        setVariants([{ size: "", price: "" }]);
      } else {
        toast.error("Failed to upload product!");
      }
    } catch (err) {
      toast.dismiss();
      toast.error("An error occurred during upload!");
    } finally {
      setSubmitting(false);
    }
  };

  // 1. Loading Screen
  if (loading) {
    return (
      <div className="min-h-screen bg-fuchsia-800 font-bold text-3xl text-white flex items-center justify-center">
        <h1>security checking......</h1>
      </div>
    );
  }

  // 2. Prevent Rendering for non-admins
  if (!isAdmin) return null;

  // 3. Admin Main Content
  return (
    <div className="min-h-screen bg-gray-100 p-6 flex flex-col items-center">
      <div className="bg-white p-8 rounded-2xl shadow-xl w-full max-w-2xl border">
        <h1 className="text-3xl font-bold text-center mb-2 text-amber-950">
          Hello Admin, Good Evening
        </h1>
        <p className="text-center text-gray-500 mb-6 text-sm">
          Upload products to your store
        </p>

        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
          {/* Path / Category Select */}
          <div className="flex items-center gap-3">
            <label className="font-bold text-gray-700">Select Category:</label>
            <select
              value={category}
              onChange={(e) => setCategory(e.target.value)}
              className="p-2 border border-gray-300 rounded-xl font-bold text-black bg-white cursor-pointer"
            >
              <option value="skincare">/skincare</option>
              <option value="bodycare">/bodycare</option>
              <option value="haircare">/haircare</option>

            </select>
          </div>

          {/* Upload Images */}
          <div className="border border-amber-200 p-4 rounded-xl flex flex-col items-center gap-3 bg-amber-50">
            <span className="font-bold text-amber-950 text-sm">Upload Product Images</span>
            
            {/* Main Image */}
            <div className="w-full">
              <label className="text-xs font-bold text-gray-600 mb-1 block">Main Image (Required):</label>
              <input
                type="file"
                accept="image/*"
                onChange={(e) => setMainImgFile(e.target.files[0])}
                className="w-full text-sm border p-2 rounded-xl bg-white text-black"
                required
              />
            </div>

            {/* Sub Images */}
            <div className="w-full">
              <label className="text-xs font-bold text-gray-600 mb-1 block">Sub Images (Optional - Max 4):</label>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-2 w-full">
                {[0, 1, 2, 3].map((i) => (
                  <input
                    key={i}
                    type="file"
                    accept="image/*"
                    onChange={(e) => {
                      const copy = [...subImgFiles];
                      copy[i] = e.target.files[0];
                      setSubImgFiles(copy);
                    }}
                    className="w-full text-xs border p-1 rounded-lg bg-white text-black"
                  />
                ))}
              </div>
            </div>
          </div>

          {/* Title */}
          <input
            type="text"
            placeholder="Product Title"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            className="p-2.5 border border-gray-300 rounded-xl text-black font-medium"
            required
          />

          {/* Description */}
          <textarea
            placeholder="Product Description"
            rows={3}
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            className="p-2.5 border border-gray-300 rounded-xl text-black font-medium"
            required
          />

          {/* Benefits */}
          <textarea
            placeholder="Benefits (Optional)"
            rows={2}
            value={benefits}
            onChange={(e) => setBenefits(e.target.value)}
            className="p-2.5 border border-gray-300 rounded-xl text-black font-medium"
          />

          {/* Dynamic Sizes & Prices */}
          <div className="border border-amber-200 p-4 rounded-xl bg-amber-50 flex flex-col gap-3">
            <div className="flex justify-between items-center">
              <span className="font-bold text-amber-950 text-sm">
                Available Sizes & Prices:
              </span>
              <button
                type="button"
                onClick={addVariantField}
                className="bg-amber-950 text-white text-xs px-3 py-1.5 rounded-lg font-bold hover:bg-amber-900 transition"
              >
                + Add Size
              </button>
            </div>

            {variants.map((item, i) => (
              <div key={i} className="flex items-center gap-2">
                <input
                  type="text"
                  placeholder="Size (e.g. 100ml)"
                  value={item.size}
                  onChange={(e) => handleVariantChange(i, "size", e.target.value)}
                  className="flex-1 p-2 border border-gray-300 rounded-lg text-black font-semibold bg-white"
                  required
                />
                <input
                  type="number"
                  placeholder="Price (e.g. 500)"
                  value={item.price}
                  onChange={(e) => handleVariantChange(i, "price", e.target.value)}
                  className="flex-1 p-2 border border-gray-300 rounded-lg text-green-700 font-bold bg-white"
                  required
                />
                {variants.length > 1 && (
                  <button
                    type="button"
                    onClick={() => removeVariantField(i)}
                    className="bg-red-500 text-white font-bold px-3 py-2 rounded-lg hover:bg-red-600 transition"
                  >
                    ✕
                  </button>
                )}
              </div>
            ))}
          </div>

          {/* Submit Button */}
          <button
            type="submit"
            disabled={submitting}
            className="bg-amber-950 text-white font-bold py-3 rounded-xl hover:bg-amber-900 transition disabled:opacity-50 cursor-pointer shadow-lg mt-2"
          >
            {submitting ? "Uploading Product..." : "Upload Product"}
          </button>
        </form>
      </div>
    </div>
  );
}