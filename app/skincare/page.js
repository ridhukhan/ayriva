import Link from "next/link";
import { headers } from "next/headers";

// Server-side ISR Fetching Function
async function getSkincareProducts() {
  try {
    // Next.js Server Component-এ Absolute URL পাওয়ার জন্য
    const headersList = await headers();
    const host = headersList.get("host");
    const protocol = process.env.NODE_ENV === "development" ? "http" : "https";
    const baseUrl = `${protocol}://${host}`;

    const res = await fetch(`${baseUrl}/api/products?category=skincare`, {
      next: { revalidate: 10 }, // ⚡ ১০ সেকেন্ড ক্যাশিং (ISR)
    });

    if (!res.ok) return [];
    const data = await res.json();
    return data?.success ? data.products : [];
  } catch (error) {
    console.error("Failed to fetch skincare products:", error);
    return [];
  }
}

export default async function SkincarePage() {
  const products = await getSkincareProducts();

  return (
    <div className="bg-white min-h-screen p-6 md:p-12 relative">
      {/* Top Left Fixed/Absolute Go Back Button */}
      <Link href={"/"} className="absolute top-4 left-4 z-10">
        <span className="bg-black text-white px-4 py-2 rounded-lg text-sm font-semibold shadow-md hover:bg-gray-800 transition">
          ← Go Back
        </span>
      </Link>

      <h1 className="text-3xl font-bold text-center mb-8 text-black mt-6 md:mt-0">
        Skincare Collection
      </h1>

      {products.length === 0 ? (
        <p className="text-center text-gray-500 font-semibold">
          No products found. Please upload from Dashboard!
        </p>
      ) : (
        /* প্রোডাক্টের ডায়নামিক গ্রিড লেআউট */
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6 max-w-7xl mx-auto">
          {products.map((item) => {
            const defaultPrice = item.variants?.[0]?.price || 0;

            return (
              <Link
                key={item._id}
                href={`/skincare/${item._id}`}
                className="border border-[#D4AF37] shadow-black shadow-lg rounded-xl p-4 flex flex-col justify-between bg-white cursor-pointer block"
              >
                <div>
                  {/* ১. মেইন ইমেজ */}
                  <div className="w-full h-48 mb-4 rounded-lg overflow-hidden bg-gray-100">
                    <img
                      src={item.mainImage}
                      alt={item.title}
                      className="w-full h-full object-cover"
                    />
                  </div>

                  {/* ২. ইমেজের নিচে টাইটেল */}
                  <h2 className="text-lg font-bold text-black mb-2 line-clamp-1">
                    {item.title}
                  </h2>

                  {/* ৩. টাইটেলের নিচে ডিফোল্ট প্রাইস */}
                  <p className="text-gray-800 font-extrabold text-xl mb-4">
                    ৳ {defaultPrice}
                  </p>
                </div>

                {/* ৪. প্রাইসের নিচে Buy Now বাটন */}
                <div className="w-full bg-yellow-700 text-black font-bold py-2.5 px-4 rounded-lg hover:bg-yellow-600 transition duration-200 text-center">
                  Buy Now
                </div>
              </Link>
            );
          })}
        </div>
      )}
    </div>
  );
}