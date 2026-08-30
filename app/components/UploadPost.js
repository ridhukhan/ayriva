"use client";

import { useState } from "react";
import { toast } from "sonner";

export default function UploadPost() {
  const [category, setCategory] = useState("skincare");
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [benefits, setBenefits] = useState("");
  const [mainImgFile, setMainImgFile] = useState(null);
  const [subImgFiles, setSubImgFiles] = useState([null, null, null, null]);
  const [variants, setVariants] = useState([{ size: "", price: "" }]);
  const [submitting, setSubmitting] = useState(false);

  const addVariantField = () => setVariants([...variants, { size: "", price: "" }]);
  const removeVariantField = (index) => setVariants(variants.filter((_, i) => i !== index));

  const handleVariantChange = (index, field, value) => {
    const updated = [...variants];
    updated[index][field] = value;
    setVariants(updated);
  };

  const uploadImage = async (file) => {
    if (!file) return "";
    const formData = new FormData();
    formData.append("file", file);
    formData.append("upload_preset", process.env.NEXT_PUBLIC_CLOUDINARY_UPLOAD_PRESET);
    const cloudName = process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME;

    const res = await fetch(`https://api.cloudinary.com/v1_1/${cloudName}/image/upload`, {
      method: "POST",
      body: formData,
    });
    const data = await res.json();
    if (!res.ok) throw new Error(data.error?.message || "Upload failed");
    return data.secure_url;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!mainImgFile) return toast.error("Main image is required!");

    setSubmitting(true);
    try {
      toast.loading("Uploading images...");
      const mainImageUrl = await uploadImage(mainImgFile);
      const subImageUrls = await Promise.all(subImgFiles.map((f) => uploadImage(f)));

      const productData = {
        category,
        mainImage: mainImageUrl,
        subImages: subImageUrls.filter(Boolean),
        title,
        description,
        benefits,
        variants: variants
          .filter((v) => v.size.trim() && v.price)
          .map((v) => ({ size: v.size, price: Number(v.price) })),
      };

      toast.dismiss();
      toast.loading("Saving to Database...");

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
      toast.error(err.message || "An error occurred!");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="bg-white p-6 md:p-8 rounded-2xl shadow-xl w-full max-w-2xl border border-amber-200">
      <h2 className="text-2xl font-bold text-center mb-1 text-amber-950">
        Upload Product
      </h2>
      <p className="text-center text-gray-500 mb-6 text-xs">
        Add new products to your inventory
      </p>

      <form onSubmit={handleSubmit} className="flex flex-col gap-4">
        <div className="flex items-center gap-3">
          <label className="font-bold text-gray-700 text-sm">Select Category:</label>
          <select
            value={category}
            onChange={(e) => setCategory(e.target.value)}
            className="p-2 border border-gray-300 rounded-xl font-bold text-black bg-white cursor-pointer text-sm"
          >
            <option value="skincare">/skincare</option>
            <option value="bodycare">/bodycare</option>
            <option value="haircare">/haircare</option>
          </select>
        </div>

        {/* Images */}
        <div className="border border-amber-200 p-4 rounded-xl flex flex-col gap-3 bg-amber-50/50">
          <span className="font-bold text-amber-950 text-xs">Product Images</span>
          <div>
            <label className="text-xs font-semibold text-gray-600 block mb-1">
              Main Image (Required):
            </label>
            <input
              type="file"
              accept="image/*"
              onChange={(e) => setMainImgFile(e.target.files[0])}
              className="w-full text-xs border p-2 rounded-xl bg-white text-black"
              required
            />
          </div>
          <div>
            <label className="text-xs font-semibold text-gray-600 block mb-1">
              Sub Images (Optional - Max 4):
            </label>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
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
                  className="w-full text-[10px] border p-1 rounded-lg bg-white text-black"
                />
              ))}
            </div>
          </div>
        </div>

        {/* Text Fields */}
        <input
          type="text"
          placeholder="Product Title"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          className="p-2.5 border border-gray-300 rounded-xl text-black font-medium text-sm"
          required
        />

        <textarea
          placeholder="Product Description"
          rows={3}
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          className="p-2.5 border border-gray-300 rounded-xl text-black font-medium text-sm whitespace-pre-line"
          required
        />

        <textarea
          placeholder="Benefits (Optional)"
          rows={2}
          value={benefits}
          onChange={(e) => setBenefits(e.target.value)}
          className="p-2.5 border border-gray-300 rounded-xl text-black font-medium text-sm"
        />

        {/* Variants */}
        <div className="border border-amber-200 p-4 rounded-xl bg-amber-50/50 flex flex-col gap-3">
          <div className="flex justify-between items-center">
            <span className="font-bold text-amber-950 text-xs">
              Sizes & Prices:
            </span>
            <button
              type="button"
              onClick={addVariantField}
              className="bg-amber-950 text-white text-[10px] px-2.5 py-1 rounded-lg font-bold"
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
                className="flex-1 p-2 border border-gray-300 rounded-lg text-black font-semibold bg-white text-xs"
                required
              />
              <input
                type="number"
                placeholder="Price (৳)"
                value={item.price}
                onChange={(e) => handleVariantChange(i, "price", e.target.value)}
                className="flex-1 p-2 border border-gray-300 rounded-lg text-green-700 font-bold bg-white text-xs"
                required
              />
              {variants.length > 1 && (
                <button
                  type="button"
                  onClick={() => removeVariantField(i)}
                  className="bg-red-500 text-white font-bold px-2.5 py-1 rounded-lg text-xs"
                >
                  ✕
                </button>
              )}
            </div>
          ))}
        </div>

        <button
          type="submit"
          disabled={submitting}
          className="bg-amber-950 text-white font-bold py-3 rounded-xl hover:bg-amber-900 transition disabled:opacity-50 cursor-pointer shadow-lg mt-2 text-sm"
        >
          {submitting ? "Uploading Product..." : "Upload Product"}
        </button>
      </form>
    </div>
  );
}