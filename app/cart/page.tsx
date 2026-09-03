"use client";

import Image from "next/image";
import Link from "next/link";

import { useCartStore } from "@/store/cartStore";

export default function CartPage() {
  const items = useCartStore((state) => state.items);
  const removeItem = useCartStore((state) => state.removeItem);
  const clearCart = useCartStore((state) => state.clearCart);
  const increaseQuantity = useCartStore((state) => state.increaseQuantity);
  const decreaseQuantity = useCartStore((state) => state.decreaseQuantity);

  const totalPrice = items.reduce(
    (total, item) => total + item.price * item.quantity,
    0,
  );

  if (items.length === 0) {
    return (
      <main className="mx-auto w-full max-w-7xl flex-1 px-6 py-16">
        <div className="mx-auto max-w-xl text-center">
          <h1 className="text-4xl font-bold text-brown-dark">
            Handlekurven din
          </h1>

          <p className="mt-6 text-lg text-brown-light">
            Handlekurven din er tom.
          </p>

          <Link
            href="/"
            className="mt-8 inline-block rounded-xl bg-pink-dark px-6 py-3 font-semibold text-white transition hover:bg-brown-light"
          >
            Se produkter
          </Link>
        </div>
      </main>
    );
  }

  return (
    <main className="mx-auto w-full max-w-7xl flex-1 px-6 py-16">
      <h1 className="text-4xl font-bold text-brown-dark">Handlekurven din</h1>

      <div className="mt-10 grid gap-10 lg:grid-cols-[1fr_350px]">
        {/* Produktene */}
        <div className="space-y-4">
          {items.map((item) => (
            <article
              key={item.id}
              className="flex gap-5 rounded-2xl border border-border bg-white p-4"
            >
              <Link
                href={`/products/${item.slug}`}
                className="relative h-28 w-28 shrink-0 overflow-hidden rounded-xl bg-surface"
              >
                <Image
                  src={item.image}
                  alt={item.name}
                  fill
                  className="object-contain p-2"
                />
              </Link>

              <div className="flex flex-1 justify-between gap-4">
                <div>
                  <Link href={`/products/${item.slug}`}>
                    <h2 className="font-semibold text-brown-dark transition hover:text-pink-dark">
                      {item.name}
                    </h2>
                  </Link>

                  <div className="mt-4 flex items-center gap-3">
                    <button
                      type="button"
                      onClick={() => decreaseQuantity(item.id)}
                      className="flex h-9 w-9 cursor-pointer items-center justify-center rounded-full border border-border text-lg font-semibold text-brown-dark transition hover:border-pink-dark hover:text-pink-dark"
                      aria-label={`Reduser antall av ${item.name}`}
                    >
                      −
                    </button>

                    <span className="min-w-6 text-center font-semibold text-brown-dark">
                      {item.quantity}
                    </span>

                    <button
                      type="button"
                      onClick={() => increaseQuantity(item.id)}
                      className="flex h-9 w-9 cursor-pointer items-center justify-center rounded-full border border-border text-lg font-semibold text-brown-dark transition hover:border-pink-dark hover:text-pink-dark"
                      aria-label={`Øk antall av ${item.name}`}
                    >
                      +
                    </button>
                  </div>

                  <div className="mt-4 space-y-1">
                    <p className="text-sm text-brown-light">
                      Enhetspris: {item.price} kr
                    </p>

                    <p className="font-bold text-pink-dark">
                      Totalt: {item.price * item.quantity} kr
                    </p>
                  </div>
                </div>

                <button
                  type="button"
                  onClick={() => removeItem(item.id)}
                  className="self-start cursor-pointer text-sm text-brown-light underline transition hover:text-pink-dark"
                >
                  Fjern
                </button>
              </div>
            </article>
          ))}
        </div>

        {/* Oppsummering */}
        <aside className="h-fit rounded-2xl border border-border bg-surface p-6">
          <h2 className="text-xl font-bold text-brown-dark">Oppsummering</h2>

          <div className="mt-6 flex justify-between border-t border-border pt-6">
            <span className="font-semibold text-brown-dark">Totalt</span>

            <span className="text-xl font-bold text-pink-dark">
              {totalPrice} kr
            </span>
          </div>

          <button
            type="button"
            className="mt-6 w-full cursor-pointer rounded-xl bg-pink-dark px-6 py-4 font-semibold text-white transition hover:bg-brown-light"
          >
            Gå til betaling
          </button>

          <button
            type="button"
            onClick={clearCart}
            className="mt-4 w-full cursor-pointer text-sm text-brown-light underline transition hover:text-pink-dark"
          >
            Tøm handlekurven
          </button>

          <p className="mt-6 text-center text-sm text-brown-light">
            Betaling kommer snart 💕
          </p>
        </aside>
      </div>
    </main>
  );
}
