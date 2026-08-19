import ProductCard from "@/components/ProductCard";
import products from "@/data/products.json";
import categories from "@/data/categories.json";

export default function Home() {
  const stickerSheets = products.filter(
    (product) => product.category === "sticker-sheet"
  );

  return (
    <main className="mx-auto max-w-7xl px-6 py-12">
      <div className="mb-10">
        <h1 className="text-4xl font-bold tracking-tight text-zinc-900">
          Klistremerkeark
        </h1>

        <p className="mt-3 text-lg text-zinc-600">
          Søte og koselige klistremerkeark for hver anledning.
        </p>
      </div>

      <section className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
        {stickerSheets.map((product) => (
          <ProductCard
            key={product.id}
            product={product}
            price={categories["sticker-sheet"].price}
          />
        ))}
      </section>
    </main>
  );
}