
import { NextResponse } from "next/server";
import Stripe from "stripe";

export const runtime = "nodejs";

export async function POST(request: Request) {
  const secretKey = process.env.STRIPE_SECRET_KEY;
  const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET;

  if (!secretKey || !webhookSecret) {
    console.error("Stripe-konfigurasjon mangler");

    return NextResponse.json(
      { error: "Serverkonfigurasjon mangler" },
      { status: 500 }
    );
  }

  const stripe = new Stripe(secretKey);

  const signature = request.headers.get("stripe-signature");

  if (!signature) {
    return NextResponse.json(
      { error: "Stripe-signatur mangler" },
      { status: 400 }
    );
  }

  const body = await request.text();

  let event: Stripe.Event;

  try {
    event = stripe.webhooks.constructEvent(
      body,
      signature,
      webhookSecret
    );
  } catch (error) {
    console.error("Ugyldig webhook-signatur:", error);

    return NextResponse.json(
      { error: "Ugyldig signatur" },
      { status: 400 }
    );
  }

  switch (event.type) {
    case "checkout.session.completed": {
      const session = event.data.object;

      if (session.payment_status === "paid") {
        console.log(
          "Betaling bekreftet:",
          session.id
        );
      } else {
        console.log(
          "Checkout fullført, betaling avventer:",
          session.id
        );
      }

      break;
    }

    case "checkout.session.async_payment_succeeded": {
      const session = event.data.object;

      console.log(
        "Forsinket betaling bekreftet:",
        session.id
      );

      break;
    }

    case "checkout.session.async_payment_failed": {
      const session = event.data.object;

      console.log(
        "Betaling mislyktes:",
        session.id
      );

      break;
    }

    default:
      console.log(
        "Ubehandlet Stripe-hendelse:",
        event.type
      );
  }

  return NextResponse.json({ received: true });
}
