
import { NextResponse } from "next/server";
import Stripe from "stripe";

import products from "@/data/products.json";
import categories from "@/data/categories.json";

export const runtime = "nodejs";

type CartItem = {
  id: string;
  quantity: number;
};

type Product = (typeof products)[number];

type Category = keyof typeof categories;

// Hent riktig pris for produktet
function getProductPrice(product: Product): number {
  // Produktpakker har egen pris
  if ("price" in product && typeof product.price === "number") {
    return product.price;
  }

  // Vanlige produkter får pris fra kategorien
  const category = categories[product.category as Category];

  if (!category) {
    throw new Error(`Ukjent kategori: ${product.category}`);
  }

  return category.price;
}

// Hent produktbilde hvis offentlig bilde-URL er konfigurert
function getProductImages(product: Product): string[] {
  const imageBaseUrl = process.env.PRODUCT_IMAGE_URL;

  // Ingen offentlig URL? Da sender vi ingen bilder til Stripe.
  if (!imageBaseUrl || !product.images?.[0]) {
    return [];
  }

  try {
    const baseUrl = new URL(imageBaseUrl);

    // Stripe må kunne hente bildet via HTTPS
    if (baseUrl.protocol !== "https:") {
      return [];
    }

    const imageUrl = new URL(
      product.images[0],
      baseUrl
    );

    return [imageUrl.toString()];
  } catch {
    console.error("Ugyldig PRODUCT_IMAGE_URL");
    return [];
  }
}

// Opprett Stripe Checkout Session
export async function POST(request: Request) {
  try {
    const secretKey = process.env.STRIPE_SECRET_KEY;
    const siteUrl = process.env.NEXT_PUBLIC_SITE_URL;

    if (!secretKey || !siteUrl) {
      throw new Error("Stripe-konfigurasjon mangler");
    }

    const stripe = new Stripe(secretKey);

    const body = await request.json();
    const items: CartItem[] = body.items;

    if (!Array.isArray(items) || items.length === 0) {
      return NextResponse.json(
        { error: "Handlekurven er tom" },
        { status: 400 }
      );
    }

    // Finn produkter og priser fra JSON-filene
    const lineItems: Stripe.Checkout.SessionCreateParams.LineItem[] =
      items.map((item) => {
        if (
          typeof item?.id !== "string" ||
          !Number.isInteger(item.quantity) ||
          item.quantity < 1 ||
          item.quantity > 99
        ) {
          throw new Error("Ugyldig produkt eller antall");
        }

        const product = products.find(
          (product) => product.id === item.id
        );

        if (!product || !product.available) {
          throw new Error("Produktet er ikke tilgjengelig");
        }

        const price = getProductPrice(product);
        const productImages = getProductImages(product);

        if (!Number.isInteger(price) || price <= 0) {
          throw new Error("Ugyldig produktpris");
        }

        return {
          price_data: {
            currency: "nok",
            product_data: {
              name: product.name,

              // Bilder vises når de er offentlig tilgjengelige
              ...(productImages.length > 0 && {
                images: productImages,
              }),

              metadata: {
                productId: product.id,
              },
            },
            unit_amount: price * 100,
          },
          quantity: item.quantity,
        };
      });

    // Opprett betalingsøkten hos Stripe
    const session = await stripe.checkout.sessions.create({
      mode: "payment",
      line_items: lineItems,
      locale: "nb",

      // Kun levering til Norge
      shipping_address_collection: {
        allowed_countries: ["NO"],
      },

      // Kunden sendes hit etter betaling
      success_url:
        `${siteUrl}/checkout/success?session_id={CHECKOUT_SESSION_ID}`,

      // Kunden sendes tilbake til handlekurven ved avbrudd
      cancel_url: `${siteUrl}/cart`,
    });

    if (!session.url) {
      throw new Error("Betalingslenke mangler");
    }

    return NextResponse.json({ url: session.url });
  } catch (error) {
    console.error("Stripe checkout error:", error);

    return NextResponse.json(
      { error: "Kunne ikke starte betaling" },
      { status: 500 }
    );
  }
}
