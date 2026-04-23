// Heading + subheading are owned by <BookConfirmedEmbed>; it swaps copy
// after Cal.com fires `bookingSuccessfulV2`.
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
      <BookConfirmedEmbed customerEmail={customerEmail} />
    </div>
  );
}
