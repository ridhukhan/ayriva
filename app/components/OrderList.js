"use client";

import { useEffect, useState } from "react";
import { toast } from "sonner";

export default function OrderList() {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchOrders() {
      try {
        const res = await fetch("/api/orders");
        const data = await res.json();
        if (data.success) {
          setOrders(data.orders || []);
        } else {
          toast.error("Failed to load orders.");
        }
      } catch (error) {
        toast.error("Error fetching orders.");
      } finally {
        setLoading(false);
      }
    }

    fetchOrders();
  }, []);

  if (loading) {
    return (
      <div className="bg-white p-8 rounded-2xl shadow-xl w-full max-w-4xl border border-amber-200 text-center">
        <h3 className="font-bold text-amber-950">Loading Orders...</h3>
      </div>
    );
  }

  return (
    <div className="bg-white p-6 md:p-8 rounded-2xl shadow-xl w-full max-w-5xl border border-amber-200 overflow-x-auto">
      <h2 className="text-2xl font-bold text-center mb-1 text-amber-950">
        Customer Orders ({orders.length})
      </h2>
      <p className="text-center text-gray-500 mb-6 text-xs">
        View all placed customer orders
      </p>

      {orders.length === 0 ? (
        <p className="text-center text-gray-500 py-8 font-semibold">
          No orders found yet!
        </p>
      ) : (
        <table className="w-full text-left border-collapse min-w-[600px]">
          <thead>
            <tr className="bg-amber-950 text-white text-xs">
              <th className="p-3 rounded-l-lg">Customer Info</th>
              <th className="p-3">Product Title</th>
              <th className="p-3">Size & Qty</th>
              <th className="p-3">Total Price</th>
              <th className="p-3 rounded-r-lg">Delivery Address</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100 text-xs">
            {orders.map((order) => (
              <tr key={order._id} className="hover:bg-amber-50/40 transition">
                <td className="p-3 font-bold text-black">
                  {order.name}
                </td>
                <td className="p-3 font-semibold text-gray-800">
                  {order.productTitle}
                </td>
                <td className="p-3 text-amber-900 font-bold">
                  {order.selectedSize} × {order.quantity}
                </td>
                <td className="p-3 font-black text-green-700">
                  ৳{order.totalPrice}
                </td>
                <td className="p-3 text-gray-600 leading-tight">
                  {order.area}, {order.policeStation}, {order.district}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
}