
import Link from "next/link";

export default function CheckoutSuccessPage() {
  return (
    <main className="mx-auto w-full max-w-7xl flex-1 px-6 py-20">
      <div className="mx-auto max-w-xl text-center">
        <div className="mb-6 text-5xl" aria-hidden="true">
          💕
        </div>

        <h1 className="text-4xl font-bold text-brown-dark">
          Takk for bestillingen!
        </h1>

        <p className="mt-6 text-lg text-brown-light">
          Du er tilbake fra Stripe Checkout.
          Vi setter opp ordrebekreftelsen snart.
        </p>

        <Link
          href="/"
          className="mt-8 inline-block rounded-xl bg-pink-dark px-6 py-3 font-semibold text-white transition hover:bg-brown-light"
        >
          Tilbake til butikken
        </Link>
      </div>
    </main>
  );
}
