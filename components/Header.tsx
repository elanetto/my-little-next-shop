"use client";

import Image from "next/image";
import Link from "next/link";

import { useCartStore } from "@/store/cartStore";

export default function Header() {
  const items = useCartStore((state) => state.items);

  const itemCount = items.reduce(
    (total, item) => total + item.quantity,
    0
  );

  return (
    <header className="border-b border-border bg-white">
      <div className="mx-auto flex max-w-7xl items-center justify-between px-6 py-5">
        <Link
          href="/"
          aria-label="Gå til forsiden"
          className="group relative block h-15 w-45"
        >
          <Image
            src="/logo-01.svg"
            alt="Elanetto Design"
            fill
            priority
            className="object-contain transition-opacity duration-300 group-hover:opacity-0"
          />

          <Image
            src="/logo-02.svg"
            alt=""
            fill
            className="object-contain opacity-0 transition-opacity duration-300 group-hover:opacity-100"
          />
        </Link>

        <nav
          aria-label="Hovedmeny"
          className="flex items-center gap-6"
        >
          <Link
            href="/"
            className="font-medium text-brown-dark transition-colors duration-300 hover:text-pink-dark"
          >
            Produkter
          </Link>

          <Link
            href="/cart"
            aria-label={`Handlekurv med ${itemCount} varer`}
            className="relative text-2xl"
          >
            🛒

            {itemCount > 0 && (
              <span className="absolute -right-3 -top-3 flex h-5 min-w-5 items-center justify-center rounded-full bg-pink-dark px-1 text-xs font-bold text-white">
                {itemCount}
              </span>
            )}
          </Link>
        </nav>
      </div>
    </header>
  );
}