import Image from "next/image";
import Link from "next/link";

export default function Header() {
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

        <nav aria-label="Hovedmeny">
          <Link
            href="/"
            className="font-medium text-brown-dark transition-colors duration-300 hover:text-pink-dark"
          >
            Produkter
          </Link>
        </nav>
      </div>
    </header>
  );
}