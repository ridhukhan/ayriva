"use client";

import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import UploadPost from "./components/UploadPost"; // পাথ চেক করুন
import OrderList from "./components/OrderList";   // পাথ চেক করুন

export default function SecretDashboard() {
  const router = useRouter();
  const [isAdmin, setIsAdmin] = useState(false);
  const [loading, setLoading] = useState(true);

  // Active Tab State: Default 'upload'
  const [activeTab, setActiveTab] = useState("upload");

  // Admin Check
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

  if (loading) {
    return (
      <div className="min-h-screen bg-amber-950 font-bold text-2xl text-white flex items-center justify-center">
        <h1>Security checking......</h1>
      </div>
    );
  }

  if (!isAdmin) return null;

  return (
    <div className="min-h-screen bg-gray-100 p-4 md:p-8 flex flex-col items-center">
      
      {/* Top Header & Navbar */}
      <div className="w-full max-w-2xl flex flex-col items-center mb-6">
        <h1 className="text-3xl font-extrabold text-amber-950 mb-4">
          Admin Dashboard
        </h1>

        {/* Tab Buttons */}
        <div className="flex bg-white p-1.5 rounded-2xl shadow-md border border-amber-200 w-full max-w-md">
          <button
            onClick={() => setActiveTab("upload")}
            className={`flex-1 py-2.5 rounded-xl font-bold text-sm transition duration-200 cursor-pointer ${
              activeTab === "upload"
                ? "bg-amber-950 text-white shadow-md"
                : "text-gray-600 hover:text-amber-950"
            }`}
          >
            Upload Post
          </button>

          <button
            onClick={() => setActiveTab("orders")}
            className={`flex-1 py-2.5 rounded-xl font-bold text-sm transition duration-200 cursor-pointer ${
              activeTab === "orders"
                ? "bg-amber-950 text-white shadow-md"
                : "text-gray-600 hover:text-amber-950"
            }`}
          >
            Order List
          </button>
        </div>
      </div>

      {/* Dynamic Content Area (Conditional Rendering) */}
      <div className="w-full flex justify-center">
        {activeTab === "upload" ? <UploadPost /> : <OrderList />}
      </div>

    </div>
  );
}