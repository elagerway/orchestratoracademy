import { NextRequest, NextResponse } from "next/server";
import { stripe } from "@/lib/stripe/server";
import { createClient } from "@supabase/supabase-js";
import Stripe from "stripe";

export const runtime = "nodejs";

const supabaseAdmin = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

export async function POST(request: NextRequest) {
  const body = await request.text();
  const signature = request.headers.get("stripe-signature");

  if (!signature) {
    return NextResponse.json({ error: "Missing signature" }, { status: 400 });
  }

  let event: Stripe.Event;

  try {
    event = stripe.webhooks.constructEvent(
      body,
      signature,
      process.env.STRIPE_WEBHOOK_SECRET!
    );
  } catch (err) {
    console.error("Webhook signature verification failed:", err);
    return NextResponse.json({ error: "Invalid signature" }, { status: 400 });
  }

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const obj = event.data.object as any;

  try {
    switch (event.type) {
      case "checkout.session.completed": {
        const userId = obj.metadata?.user_id as string | undefined;
        const plan = obj.metadata?.plan as "pro" | "team" | undefined;
        const customerId = obj.customer as string;
        const subscriptionId = obj.subscription as string;

        if (!userId) break;

        const stripeSubscription =
          await stripe.subscriptions.retrieve(subscriptionId);
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        const periodEnd = (stripeSubscription as any).current_period_end as number;

        const { error } = await supabaseAdmin.from("subscriptions").upsert(
          {
            user_id: userId,
            stripe_customer_id: customerId,
            stripe_subscription_id: subscriptionId,
            plan: plan || "pro",
            status: "active",
            current_period_end: new Date(periodEnd * 1000).toISOString(),
            updated_at: new Date().toISOString(),
          },
          { onConflict: "user_id" }
        );

        if (error) {
          console.error("Error upserting subscription:", error);
        }
        break;
      }

      case "invoice.paid": {
        const customerId = obj.customer as string;
        const subscriptionId = obj.subscription as string;

        const { data: sub } = await supabaseAdmin
          .from("subscriptions")
          .select("*")
          .eq("stripe_customer_id", customerId)
          .single();

        if (sub) {
          await supabaseAdmin.from("payments").insert({
            user_id: sub.user_id,
            stripe_payment_id: obj.payment_intent as string,
            amount: obj.amount_paid as number,
            currency: obj.currency as string,
            status: "succeeded",
          });

          await supabaseAdmin
            .from("subscriptions")
            .update({
              status: "active",
              updated_at: new Date().toISOString(),
            })
            .eq("stripe_subscription_id", subscriptionId);
        }
        break;
      }

      case "invoice.payment_failed": {
        const subscriptionId = obj.subscription as string;

        await supabaseAdmin
          .from("subscriptions")
          .update({
            status: "past_due",
            updated_at: new Date().toISOString(),
          })
          .eq("stripe_subscription_id", subscriptionId);
        break;
      }

      case "customer.subscription.updated": {
        const subscriptionId = obj.id as string;

        const priceId = obj.items?.data?.[0]?.price?.id as string | undefined;
        let plan: string | undefined;
        if (priceId === process.env.STRIPE_PRO_PRICE_ID) {
          plan = "pro";
        } else if (priceId === process.env.STRIPE_TEAM_PRICE_ID) {
          plan = "team";
        }

        const periodEnd = obj.current_period_end as number;
        const updateData: Record<string, unknown> = {
          status: obj.status === "active" ? "active" : obj.status,
          current_period_end: new Date(periodEnd * 1000).toISOString(),
          updated_at: new Date().toISOString(),
        };

        if (plan) {
          updateData.plan = plan;
        }

        await supabaseAdmin
          .from("subscriptions")
          .update(updateData)
          .eq("stripe_subscription_id", subscriptionId);
        break;
      }

      case "customer.subscription.deleted": {
        await supabaseAdmin
          .from("subscriptions")
          .update({
            status: "canceled",
            updated_at: new Date().toISOString(),
          })
          .eq("stripe_subscription_id", obj.id as string);
        break;
      }

      default:
        break;
    }
  } catch (error) {
    console.error("Webhook handler error:", error);
    return NextResponse.json(
      { error: "Webhook handler failed" },
      { status: 500 }
    );
  }

  return NextResponse.json({ received: true });
}
