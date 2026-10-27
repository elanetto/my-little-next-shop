
"use client";

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";

import { useCartStore } from "@/store/cartStore";

export default function CartPage() {
  const items = useCartStore((state) => state.items);
  const removeItem = useCartStore((state) => state.removeItem);
  const clearCart = useCartStore((state) => state.clearCart);
  const increaseQuantity = useCartStore((state) => state.increaseQuantity);
  const decreaseQuantity = useCartStore((state) => state.decreaseQuantity);

  // Stripe Checkout
  const [isLoading, setIsLoading] = useState(false);
  const [checkoutError, setCheckoutError] = useState("");

  const handleCheckout = async () => {
    if (isLoading || items.length === 0) return;

    setIsLoading(true);
    setCheckoutError("");

    try {
      const response = await fetch("/api/checkout", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          items: items.map((item) => ({
            id: item.id,
            quantity: item.quantity,
          })),
        }),
      });

      if (!response.ok) {
        throw new Error("Kunne ikke starte betaling");
      }

      const data = await response.json();

      if (!data.url) {
        throw new Error("Ingen betalingslenke mottatt");
      }

      // Send kunden til Stripe Checkout
      window.location.assign(data.url);
    } catch (error) {
      console.error("Checkout error:", error);

      setCheckoutError(
        "Noe gikk galt med betalingen. Prøv igjen."
      );

      setIsLoading(false);
    }
  };

  // Beregn totalpris
  const totalPrice = items.reduce(
    (total, item) => total + item.price * item.quantity,
    0
  );

  // Tom handlekurv
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
      <h1 className="text-4xl font-bold text-brown-dark">
        Handlekurven din
      </h1>

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

                  {/* Antall produkter */}
                  <div className="mt-4 flex items-center gap-3">
                    <button
                      type="button"
                      onClick={() => decreaseQuantity(item.id)}
                      disabled={isLoading}
                      className="flex h-9 w-9 cursor-pointer items-center justify-center rounded-full border border-border text-lg font-semibold text-brown-dark transition hover:border-pink-dark hover:text-pink-dark disabled:cursor-not-allowed disabled:opacity-50"
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
                      disabled={isLoading}
                      className="flex h-9 w-9 cursor-pointer items-center justify-center rounded-full border border-border text-lg font-semibold text-brown-dark transition hover:border-pink-dark hover:text-pink-dark disabled:cursor-not-allowed disabled:opacity-50"
                      aria-label={`Øk antall av ${item.name}`}
                    >
                      +
                    </button>
                  </div>

                  {/* Produktpriser */}
                  <div className="mt-4 space-y-1">
                    <p className="text-sm text-brown-light">
                      Enhetspris: {item.price} kr
                    </p>

                    <p className="font-bold text-pink-dark">
                      Totalt: {item.price * item.quantity} kr
                    </p>
                  </div>
                </div>

                {/* Fjern produkt */}
                <button
                  type="button"
                  onClick={() => removeItem(item.id)}
                  disabled={isLoading}
                  className="self-start cursor-pointer text-sm text-brown-light underline transition hover:text-pink-dark disabled:cursor-not-allowed disabled:opacity-50"
                >
                  Fjern
                </button>
              </div>
            </article>
          ))}
        </div>

        {/* Oppsummering */}
        <aside className="h-fit rounded-2xl border border-border bg-surface p-6">
          <h2 className="text-xl font-bold text-brown-dark">
            Oppsummering
          </h2>

          <div className="mt-6 flex justify-between border-t border-border pt-6">
            <span className="font-semibold text-brown-dark">
              Totalt
            </span>

            <span className="text-xl font-bold text-pink-dark">
              {totalPrice} kr
            </span>
          </div>

          {/* Stripe Checkout-knapp */}
          <button
            type="button"
            onClick={handleCheckout}
            disabled={isLoading}
            className="mt-6 w-full cursor-pointer rounded-xl bg-pink-dark px-6 py-4 font-semibold text-white transition hover:bg-brown-light disabled:cursor-not-allowed disabled:opacity-50"
          >
            {isLoading
              ? "Sender deg til betaling..."
              : "Gå til betaling"}
          </button>

          {/* Feilmelding */}
          {checkoutError && (
            <p
              role="alert"
              className="mt-3 text-center text-sm text-red-600"
            >
              {checkoutError}
            </p>
          )}

          {/* Tøm handlekurven */}
          <button
            type="button"
            onClick={clearCart}
            disabled={isLoading}
            className="mt-4 w-full cursor-pointer text-sm text-brown-light underline transition hover:text-pink-dark disabled:cursor-not-allowed disabled:opacity-50"
          >
            Tøm handlekurven
          </button>

          <p className="mt-6 text-center text-sm text-brown-light">
            Sikker betaling med Stripe 💕
          </p>
        </aside>
      </div>
    </main>
  );
}
