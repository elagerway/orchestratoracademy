// Thin Magpipe client. Currently used for sending SMS alerts on new signups.
// API reference: https://api.magpipe.ai/functions/v1

const DEFAULT_BASE = "https://api.magpipe.ai/functions/v1";

export interface SendSmsInput {
  serviceNumber: string;
  contactPhone: string;
  message: string;
}

export async function sendSms(input: SendSmsInput): Promise<void> {
  const key = process.env.MAGPIPE_API_KEY;
  if (!key) throw new Error("MAGPIPE_API_KEY missing");

  const base = process.env.MAGPIPE_API_URL?.replace(/\/$/, "") || DEFAULT_BASE;
  const res = await fetch(`${base}/send-user-sms`, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${key}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify(input),
  });

  if (!res.ok) {
    const text = await res.text();
    throw new Error(`Magpipe send-sms failed (${res.status}): ${text}`);
  }
}
