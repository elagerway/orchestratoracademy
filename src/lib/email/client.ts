import { ServerClient } from "postmark";

let client: ServerClient | null = null;

export function getPostmarkClient() {
  if (!client) {
    client = new ServerClient(process.env.POSTMARK_API_KEY!);
  }
  return client;
}

export async function sendEmail(params: {
  to: string;
  subject: string;
  html: string;
}) {
  const pm = getPostmarkClient();
  return pm.sendEmail({
    From: "learn@orchestratoracademy.com",
    To: params.to,
    Subject: params.subject,
    HtmlBody: params.html,
    MessageStream: "outbound",
  });
}
