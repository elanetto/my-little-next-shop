import Image from "next/image";
import Link from "next/link";

type ProductCardProps = {
  product: {
    id: string;
    name: string;
    slug: string;
    category: string;
    images: string[];
  };
  price: number;
};

export default function ProductCard({ product, price }: ProductCardProps) {
  return (
    <article className="group overflow-hidden rounded-2xl border border-border bg-white shadow-sm transition hover:-translate-y-1 hover:shadow-md">
      <Link href={`/products/${product.slug}`}>
        <div className="relative aspect-square overflow-hidden bg-surface">
          <Image
            src={product.images[0]}
            alt={product.name}
            fill
            className="object-contain p-5 transition-opacity duration-300 group-hover:opacity-0"
          />

          {product.images[1] && (
            <Image
              src={product.images[1]}
              alt={`${product.name} - alternativt bilde`}
              fill
              className="scale-200 translate-y-8 object-contain p-5 opacity-0 transition-opacity duration-300 group-hover:opacity-100"
            />
          )}
        </div>

        <div className="p-5">
          <h2 className="text-lg font-semibold text-brown-dark">
            {product.name}
          </h2>

          <p className="mt-3 text-lg font-bold text-pink-dark">{price} kr</p>
        </div>
      </Link>
    </article>
  );
}
