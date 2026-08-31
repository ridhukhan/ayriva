"use client";

import { useRouter } from "next/navigation";
import { useState, useEffect } from "react";

export default function Profile() {
  const [user, setUser] = useState(null);
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [loggingOut, setLoggingOut] = useState(false);

  useEffect(() => {
    async function getUser() {
      try {
        const res = await fetch("/api/me");
        if (res.ok) {
          const data = await res.json();
          setUser(data.user);
        } else {
          router.push("/");
          return;
        }
      } catch (error) {
        console.error("Failed to fetch user:", error);
        router.push("/");
      } finally {
        setLoading(false);
      }
    }

    getUser();
  }, [router]);

  const handleLogout = async () => {
    try {
      setLoggingOut(true);
      const res = await fetch("/api/logout", { method: "POST" });

      if (res.ok) {
        router.push("/");
        router.refresh();
      } else {
        setLoggingOut(false);
      }
    } catch (error) {
      console.error("Logout failed:", error);
      setLoggingOut(false);
    }
  };

  if (loading) {
    return (
      <div className="flex min-h-screen w-full items-center justify-center bg-amber-50">
        <h2 className="text-xl font-bold text-amber-950 animate-pulse">
          Loading profile...
        </h2>
      </div>
    );
  }

  return (
    <div className="flex flex-col min-h-screen w-full items-center justify-center text-center p-4 gap-4">
      <h1 className="text-3xl font-bold text-gray-900">{user?.username}</h1>
      <h2 className="text-xl text-gray-600">{user?.email}</h2>

      <button
        disabled={loggingOut}
        onClick={handleLogout}
        className="bg-red-600 hover:bg-red-700 disabled:opacity-50 text-white text-lg font-bold px-6 py-2 rounded-xl transition cursor-pointer"
      >
        {loggingOut ? "Logging out..." : "Logout"}
      </button>
    </div>
  );
}