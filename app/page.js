import Link from "next/link";
import HeroSlider from "./components/hero";
import { headers } from "next/headers";
import NavbarUserButton from "./components/NavbarUserButton"; // ইউজার লগইন চেক করার ছোট ক্লায়েন্ট কম্পোনেন্ট

// Server-side ISR Fetching Function
async function getHomeCategoryProducts() {
  try {
    const headersList = await headers();
    const host = headersList.get("host");
    const protocol = process.env.NODE_ENV === "development" ? "http" : "https";
    const baseUrl = `${protocol}://${host}`;

    const [skinRes, bodyRes, hairRes] = await Promise.all([
      fetch(`${baseUrl}/api/products?category=skincare&limit=4`, { next: { revalidate: 10 } }),
      fetch(`${baseUrl}/api/products?category=bodycare&limit=4`, { next: { revalidate: 10 } }),
      fetch(`${baseUrl}/api/products?category=haircare&limit=4`, { next: { revalidate: 10 } }),
    ]);

    const skinData = await skinRes.json();
    const bodyData = await bodyRes.json();
    const hairData = await hairRes.json();

    return {
      skincareProducts: skinData?.success ? skinData.products : [],
      bodycareProducts: bodyData?.success ? bodyData.products : [],
      haircareProducts: hairData?.success ? hairData.products : [],
    };
  } catch (error) {
    console.error("Failed to fetch home products:", error);
    return { skincareProducts: [], bodycareProducts: [], haircareProducts: [] };
  }
}

export default async function Home() {
  const { skincareProducts, bodycareProducts, haircareProducts } = await getHomeCategoryProducts();

  // Reusable section renderer
  const renderProductSection = (title, categoryPath, products) => {
    return (
      <section className="mt-8 px-4 max-w-5xl mx-auto">
        {/* Section Header */}
        <div className="flex justify-between items-center mb-4 border-b border-[#D4AF37] pb-2">
          <h2 className="text-xl md:text-2xl font-bold text-amber-950">
            {title}
          </h2>
          <Link
            href={`/${categoryPath}`}
            className="text-xs md:text-sm font-bold text-yellow-800 hover:underline"
          >
            See All →
          </Link>
        </div>

        {/* Product Grid: 1 line a 2 ta product (grid-cols-2) */}
        {products.length === 0 ? (
          <p className="text-gray-500 text-sm italic">
            No products available.
          </p>
        ) : (
          <div className="grid grid-cols-2 gap-4">
            {products.map((item) => {
              const defaultPrice = item.variants?.[0]?.price || 0;

              return (
                <div
                  key={item._id}
                  className="border border-[#D4AF37] shadow-black shadow-md rounded-xl p-3 md:p-4 flex flex-col justify-between bg-white"
                >
                  <div>
                    {/* Main Image */}
                    <div className="w-full h-36 md:h-48 mb-3 rounded-lg overflow-hidden bg-gray-100">
                      <img
                        src={item.mainImage}
                        alt={item.title}
                        className="w-full h-full object-cover"
                      />
                    </div>

                    {/* Title */}
                    <h3 className="text-sm md:text-base font-bold text-black line-clamp-1 mb-1">
                      {item.title}
                    </h3>

                    {/* Default Price */}
                    <p className="text-gray-900 font-extrabold text-base md:text-lg mb-3">
                      ৳ {defaultPrice}
                    </p>
                  </div>

                  {/* Buy Now Link */}
                  <Link
                    href={`/${categoryPath}/${item._id}`}
                    className="w-full bg-yellow-700 text-black font-bold py-2 px-2 md:px-4 text-xs md:text-sm rounded-lg hover:bg-yellow-600 transition text-center block"
                  >
                    Buy Now
                  </Link>
                </div>
              );
            })}
          </div>
        )}
      </section>
    );
  };

  return (
    <div className="bg-amber-50 min-h-screen w-full pb-12">
      {/* Navbar */}
      <nav className="bg-amber-950 items-center justify-between flex h-18 w-full top-2 px-4">
        <div>
          <img
            className="w-30 h-10 ml-2 justify-center top-2 rounded-3xl shadow-[3px_7px_15px_#000]"
            src="https://res.cloudinary.com/dfzaefrkt/image/upload/v1787719042/IMG_20260826_100801.jpg_qxlefw.jpg"
            alt="Logo"
          />
        </div>
        <div>
          <NavbarUserButton />
        </div>
      </nav>

      {/* Hero Section */}
      <section>
        <HeroSlider />
      </section>

      {/* 1st Section: Skincare */}
      {renderProductSection("Skincare Collection", "skincare", skincareProducts)}

      {/* 2nd Section: Bodycare */}
      {renderProductSection("Bodycare Collection", "bodycare", bodycareProducts)}

      {/* 3rd Section: Haircare */}
      {renderProductSection("Haircare Collection", "haircare", haircareProducts)}
    </div>
  );
}