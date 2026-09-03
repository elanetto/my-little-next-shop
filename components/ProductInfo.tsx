"use client";

import { useCartStore } from "@/store/cartStore";

type ProductInfoProps = {
  id: string;
  name: string;
  slug: string;
  image: string;
  description: string;
  price: number;
  width: number;
  height: number;
  unit: string;
};

export default function ProductInfo({
  id,
  name,
  slug,
  image,
  description,
  price,
  width,
  height,
  unit,
}: ProductInfoProps) {
  const addItem = useCartStore((state) => state.addItem);

  function handleAddToCart() {
    addItem({
      id,
      name,
      slug,
      image,
      price,
    });
  }

  return (
    <div>
      <h1 className="text-4xl font-bold text-brown-dark">
        {name}
      </h1>

      <p className="mt-4 text-2xl font-bold text-pink-dark">
        {price} kr
      </p>

      <p className="mt-6 leading-7 text-brown-light">
        {description}
      </p>

      <div className="mt-6 border-t border-border pt-6">
        <h2 className="font-semibold text-brown-dark">
          Produktinformasjon
        </h2>

        <p className="mt-2 text-brown-light">
          Størrelse: {width} × {height} {unit}
        </p>
      </div>

      <button
        type="button"
        onClick={handleAddToCart}
        className="mt-8 w-full cursor-pointer rounded-xl bg-pink-dark px-6 py-4 font-semibold text-white transition hover:bg-brown-light"
      >
        Legg i handlekurv
      </button>
    </div>
  );
}