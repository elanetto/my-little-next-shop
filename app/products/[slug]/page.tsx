import type { Metadata } from "next";
import { notFound } from "next/navigation";

import ProductGallery from "@/components/ProductGallery";
import ProductInfo from "@/components/ProductInfo";

import products from "@/data/products.json";
import categories from "@/data/categories.json";

type ProductPageProps = {
  params: Promise<{
    slug: string;
  }>;
};

export async function generateMetadata({
  params,
}: ProductPageProps): Promise<Metadata> {
  const { slug } = await params;

  const product = products.find(
    (product) => product.slug === slug
  );

  if (!product) {
    return {
      title: "Produkt ikke funnet",
      description: "Produktet du leter etter finnes ikke.",
    };
  }

  const mainImage = product.images[0];

  return {
    title: product.name,
    description: product.description,

    openGraph: {
      title: product.name,
      description: product.description,
      type: "website",
      images: [
        {
          url: mainImage,
          alt: product.name,
        },
      ],
    },

    twitter: {
      card: "summary_large_image",
      title: product.name,
      description: product.description,
      images: [mainImage],
    },
  };
}

export default async function ProductPage({
  params,
}: ProductPageProps) {
  const { slug } = await params;

  const product = products.find(
    (product) => product.slug === slug
  );

  if (!product) {
    notFound();
  }

  if (product.category === "bundle") {
    return (
      <main className="mx-auto max-w-7xl px-6 py-12">
        <p>Pakke-side kommer senere.</p>
      </main>
    );
  }

  if (!product.dimensions) {
    notFound();
  }

  const category =
    categories[
      product.category as keyof typeof categories
    ];

  if (!category) {
    notFound();
  }

  return (
    <main className="mx-auto max-w-7xl px-6 py-12">
      <div className="grid gap-12 lg:grid-cols-2">
        <ProductGallery
          images={product.images}
          productName={product.name}
        />

        <ProductInfo
          name={product.name}
          description={product.description}
          price={category.price}
          width={product.dimensions.width}
          height={product.dimensions.height}
          unit={product.dimensions.unit}
        />
      </div>
    </main>
  );
}