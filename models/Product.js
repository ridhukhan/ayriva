import mongoose from "mongoose";

const productSchema = new mongoose.Schema(
  {
    category: { type: String, required: true }, // "skincare" or "bodycare"
    mainImage: { type: String, required: true },
    subImages: [{ type: String }], // ৪টি অতিরিক্ত ছবির Array
    title: { type: String, required: true },
    description: { type: String, required: true },
    benefits: { type: String },
    variants: [
      {
        size: { type: String, required: true },
        price: { type: Number, required: true },
      },
    ],
  },
  { timestamps: true }
);

export default mongoose.models.Product || mongoose.model("Product", productSchema);