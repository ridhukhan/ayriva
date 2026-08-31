import mongoose from "mongoose";

const orderSchema = new mongoose.Schema(
  {
    productTitle: { type: String, required: true },
    productId: { type: String, required: true },
    selectedSize: { type: String, required: true },
    unitPrice: { type: Number, required: true },
    quantity: { type: Number, required: true },
    totalPrice: { type: Number, required: true },
    name: { type: String, required: true },
    district: { type: String, required: true },
    phone: { type: String, required: true },

    
    policeStation: { type: String, required: true },
    area: { type: String, required: true },
  },
  { timestamps: true }
);

export default mongoose.models.Order || mongoose.model("Order", orderSchema);