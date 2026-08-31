import ProductDetailPageClient from "./ProductDetailPageClient";

// 🚀 WhatsApp & Social Media Preview Generator
export async function generateMetadata({ params }) {
  const { id } = await params;
  
  // আপনার ডোমেইন URL (প্রোডাকশন URL)
  const baseUrl = "https://ayriva.netlify.app"; 

  try {
    const res = await fetch(`${baseUrl}/api/products/${id}`, { cache: "no-store" });
    const data = await res.json();
    const product = data?.product;

    if (!product) {
      return { title: "Product Not Found | Ayriva" };
    }

    return {
      title: `${product.title} | Ayriva`,
      description: product.description?.substring(0, 150) || "Authentic skincare product",
      openGraph: {
        title: product.title,
        description: product.description?.substring(0, 150),
        url: `${baseUrl}/skincare/${id}`,
        siteName: "Ayriva",
        images: [
          {
            url: product.mainImage, // 📸 প্রোডাক্টের মেইন পিকচারের URL
            width: 800,
            height: 600,
            alt: product.title,
          },
        ],
        type: "website",
      },
    };
  } catch (error) {
    return { title: "Ayriva Skincare" };
  }
}

export default async function Page({ params }) {
  return <ProductDetailPageClient params={params} />;
}