import { redirect } from "next/navigation";
import { stripe } from "@/lib/stripe/server";
import { BookConfirmedEmbed } from "./embed";

interface ConfirmedPageProps {
  searchParams: Promise<{ session_id?: string }>;
}

export default async function BookConfirmedPage({ searchParams }: ConfirmedPageProps) {
  const { session_id } = await searchParams;

  if (!session_id) {
    redirect("/book");
  }

  let paid = false;
  let customerEmail: string | null = null;
  try {
    const session = await stripe.checkout.sessions.retrieve(session_id);
    paid =
      session.payment_status === "paid" &&
      session.metadata?.type === "consult_booking";
    customerEmail = session.customer_details?.email ?? null;
  } catch {
    redirect("/book");
  }

  if (!paid) {
    redirect("/book");
  }

  return (
    <div className="mx-auto max-w-5xl px-4 py-16">
      <div className="mb-10 text-center">
        <div className="mb-4 inline-flex items-center gap-2 rounded-full border border-emerald-accent/30 bg-emerald-accent/10 px-3 py-1 text-sm font-medium text-emerald-accent">
          Payment received
        </div>
        <h1 className="font-heading text-4xl font-bold tracking-tight sm:text-5xl">
          You&rsquo;re in — now pick a slot
        </h1>
        <p className="mx-auto mt-4 max-w-2xl text-lg text-muted-foreground">
          Thanks{customerEmail ? `, ${customerEmail}` : ""}. Your 1-hour session is paid.
          Pick any time below and you&rsquo;ll get the calendar invite instantly.
        </p>
      </div>

      <BookConfirmedEmbed />
    </div>
  );
}
