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

  // 🔄 Status Update Handler (Pending, Confirm, Return)
  const handleStatusChange = async (orderId, newStatus) => {
    try {
      const res = await fetch(`/api/orders/${orderId}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({id:orderId, status: newStatus }),
      });

      const data = await res.json();
      if (res.ok && data.success) {
        toast.success(`Order status updated to ${newStatus}`);
        setOrders((prev) =>
          prev.map((order) =>
            order._id === orderId ? { ...order, status: newStatus } : order
          )
        );
      } else {
        toast.error(data.message || "Failed to update status.");
      }
    } catch (error) {
      toast.error("Error updating order status.");
    }
  };

  // 🗑️ Delete/Cancel Handler
  const handleDeleteOrder = async (orderId) => {
    if (!confirm("Are you sure you want to cancel & delete this order?")) return;

    try {
      const res = await fetch(`/api/orders?id=${orderId}`, {
        method: "DELETE",
      });

      const data = await res.json();
      if (res.ok && data.success) {
        toast.success("Order cancelled and removed.");
        setOrders((prev) => prev.filter((order) => order._id !== orderId));
      } else {
        toast.error(data.message || "Failed to delete order.");
      }
    } catch (error) {
      toast.error("Error deleting order.");
    }
  };

  if (loading) {
    return (
      <div className="bg-white p-8 rounded-2xl shadow-xl w-full max-w-4xl border border-amber-200 text-center">
        <h3 className="font-bold text-amber-950">Loading Orders...</h3>
      </div>
    );
  }

  return (
    <div className="bg-white p-6 md:p-8 rounded-2xl shadow-xl w-full max-w-6xl border border-amber-200 overflow-x-auto">
      <h2 className="text-2xl font-bold text-center mb-1 text-amber-950">
        Customer Orders ({orders.length})
      </h2>
      <p className="text-center text-gray-500 mb-6 text-xs">
        View & manage all placed customer orders
      </p>

      {orders.length === 0 ? (
        <p className="text-center text-gray-500 py-8 font-semibold">
          No orders found yet!
        </p>
      ) : (
        <table className="w-full text-left border-collapse min-w-[800px]">
          <thead>
            <tr className="bg-amber-950 text-white text-xs">
              <th className="p-3 rounded-l-lg">Customer Info</th>
              <th className="p-3">Product Title</th>
              <th className="p-3">Size & Qty</th>
              <th className="p-3">Total Price</th>
              <th className="p-3">Delivery Address</th>
              <th className="p-3">Status</th>
              <th className="p-3 rounded-r-lg text-center">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100 text-xs">
            {orders.map((order) => {
              const currentStatus = order.status || "Pending";

              return (
                <tr key={order._id} className="hover:bg-amber-50/40 transition">
                  <td className="p-3 font-bold text-black">
                    <div>{order.name}</div>
                    <div className="text-[10px] text-gray-500">{order.phone}</div>
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

                  {/* 📌 Current Status Badge */}
                  <td className="p-3 font-bold">
                    <span
                      className={`px-2.5 py-1 rounded-full text-[10px] uppercase tracking-wider ${
                        currentStatus === "Confirm"
                          ? "bg-green-100 text-green-800 border border-green-300"
                          : currentStatus === "Return"
                          ? "bg-red-100 text-red-800 border border-red-300"
                          : "bg-yellow-100 text-yellow-800 border border-yellow-300"
                      }`}
                    >
                      {currentStatus}
                    </span>
                  </td>

                  {/* ⚙️ Status Actions & Cancel Button */}
                  <td className="p-3 text-center">
                    <div className="flex items-center justify-center gap-1.5">
                      <button
                        onClick={() => handleStatusChange(order._id, "Pending")}
                        className={`px-2 py-1 rounded text-[11px] font-semibold transition ${
                          currentStatus === "Pending"
                            ? "bg-yellow-500 text-white"
                            : "bg-gray-100 hover:bg-yellow-100 text-gray-700"
                        }`}
                      >
                        Pending
                      </button>

                      <button
                        onClick={() => handleStatusChange(order._id, "Confirm")}
                        className={`px-2 py-1 rounded text-[11px] font-semibold transition ${
                          currentStatus === "Confirm"
                            ? "bg-green-600 text-white"
                            : "bg-gray-100 hover:bg-green-100 text-gray-700"
                        }`}
                      >
                        Confirm
                      </button>

                      <button
                        onClick={() => handleStatusChange(order._id, "Return")}
                        className={`px-2 py-1 rounded text-[11px] font-semibold transition ${
                          currentStatus === "Return"
                            ? "bg-amber-700 text-white"
                            : "bg-gray-100 hover:bg-amber-100 text-gray-700"
                        }`}
                      >
                        Return
                      </button>

                      <button
                        onClick={() => handleDeleteOrder(order._id)}
                        className="bg-red-600 hover:bg-red-700 text-white px-2 py-1 rounded text-[11px] font-bold transition ml-1"
                        title="Cancel & Delete Order"
                      >
                        Cancel
                      </button>
                    </div>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      )}
    </div>
  );
}