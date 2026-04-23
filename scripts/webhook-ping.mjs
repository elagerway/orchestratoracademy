// Signs a synthetic Stripe event and POSTs it to the webhook route.
// 200 = signature verifies against STRIPE_WEBHOOK_SECRET.
// Usage:
//   node scripts/webhook-ping.mjs                                    # prod
//   node scripts/webhook-ping.mjs http://localhost:3001/api/...      # local
import crypto from "crypto";
import { readFileSync } from "fs";

const env = {};
for (const line of readFileSync(new URL("../.env.local", import.meta.url), "utf8").split("\n")) {
  const m = line.match(/^([A-Z_]+)=(.*)$/);
  if (m) env[m[1]] = m[2].replace(/^["']|["']$/g, "");
}

const SECRET = env.STRIPE_WEBHOOK_SECRET;
if (!SECRET) {
  console.error("STRIPE_WEBHOOK_SECRET not found in .env.local");
  process.exit(1);
}
const URL = process.argv[2] || "https://www.orchestratoracademy.com/api/stripe/webhook";

const payload = JSON.stringify({
  id: "evt_test_webhook",
  object: "event",
  api_version: "2020-03-02",
  created: Math.floor(Date.now() / 1000),
  data: {
    object: {
      id: "cs_test_ping",
      object: "checkout.session",
      metadata: { type: "consult_booking" },
      payment_status: "paid",
    },
  },
  livemode: true,
  type: "checkout.session.completed",
});

const timestamp = Math.floor(Date.now() / 1000);
const signed = `${timestamp}.${payload}`;
const sig = crypto.createHmac("sha256", SECRET).update(signed).digest("hex");
const header = `t=${timestamp},v1=${sig}`;

const res = await fetch(URL, {
  method: "POST",
  headers: {
    "Content-Type": "application/json",
    "Stripe-Signature": header,
  },
  body: payload,
});

console.log("URL:", URL);
console.log("Status:", res.status);
console.log("Body:", await res.text());
