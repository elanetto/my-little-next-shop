import Image from "next/image";

export default function Footer() {
  return (
    <footer className="mt-auto bg-brown-dark text-white">
      <div className="mx-auto flex max-w-7xl flex-col items-center px-6 py-10 text-center">
        <Image
          src="/star.png"
          alt=""
          width={45}
          height={45}
          className="mb-4"
        />

        <p className="text-sm">
          © {new Date().getFullYear()} Elanetto Design
        </p>

        <p className="mt-1 text-sm opacity-70">
          Illustrert, printet og pakket med kjærlighet.
        </p>
      </div>
    </footer>
  );
}