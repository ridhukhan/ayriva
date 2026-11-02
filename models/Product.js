import mongoose from "mongoose";

const productSchema = new mongoose.Schema(
  {
    category: { type: String, required: true }, // "skincare" or "bodycare"
    mainImage: { type: String, required: true },
    subImages: [{ type: String }], // ৪টি অতিরিক্ত ছবির Array
    title: { type: String },
    description: { type: String },
    benefits: { type: String },
    affiliateLink: { type: String, default: "" },
    variants: [
      {
        size: { type: String },
        price: { type: Number },
      },
    ],
  },
  { timestamps: true }
);

export default mongoose.models.Product || mongoose.model("Product", productSchema);