import Link from "next/link";
import { headers } from "next/headers";
import ProductDetailsClient from "./ProductDetailsClient";

// Server-side ISR Fetching for Product Details
async function getProductDetails(id) {
  try {
    const headersList = await headers();
    const host = headersList.get("host");
    const protocol = process.env.NODE_ENV === "development" ? "http" : "https";
    const baseUrl = `${protocol}://${host}`;

    const res = await fetch(`${baseUrl}/api/products/${id}`, {
      next: { revalidate: 10 }, // ⚡ ১০ সেকেন্ড ISR ক্যাশিং
    });

    if (!res.ok) return null;
    const data = await res.json();
    return data?.success ? data.product : null;
  } catch (error) {
    console.error("Failed to fetch product:", error);
    return null;
  }
}

export default async function ProductDetailsPage({ params }) {
  const resolvedParams = await params;
  const product = await getProductDetails(resolvedParams.id);

  if (!product) {
    return (
      <div className="min-h-screen bg-white flex flex-col items-center justify-center gap-4">
        <h2 className="text-xl font-bold text-red-600">Product not found!</h2>
        <Link href="/skincare" className="bg-black text-white px-4 py-2 rounded-lg text-sm">
          Return to Skincare
        </Link>
      </div>
    );
  }

  return <ProductDetailsClient product={product} />;
}