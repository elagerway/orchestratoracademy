import { NextRequest, NextResponse } from "next/server";
import { stripe } from "@/lib/stripe/server";

const CONSULT_PRICE_CENTS = 22000;

export async function POST(request: NextRequest) {
  try {
    const origin =
      request.headers.get("origin") || process.env.NEXT_PUBLIC_SITE_URL!;

    const session = await stripe.checkout.sessions.create({
      mode: "payment",
      line_items: [
        {
          price_data: {
            currency: "usd",
            unit_amount: CONSULT_PRICE_CENTS,
            product_data: {
              name: "1-hour AI Orchestrator consult",
              description:
                "One-hour 1:1 session with the Orchestrator Academy team.",
            },
          },
          quantity: 1,
        },
      ],
      success_url: `${origin}/book/confirmed?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${origin}/book?canceled=1`,
      metadata: {
        type: "consult_booking",
      },
    });

    return NextResponse.json({ url: session.url });
  } catch (error) {
    console.error("Book-checkout error:", error);
    return NextResponse.json(
      { error: "Failed to create checkout session" },
      { status: 500 },
    );
  }
}
