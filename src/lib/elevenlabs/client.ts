const ELEVENLABS_API_BASE = "https://api.elevenlabs.io/v1";

function getApiKey() {
  return process.env.ELEVENLABS_API_KEY!;
}

export async function generateSpeech(
  text: string,
  voiceId?: string
): Promise<Buffer> {
  const voice = voiceId || process.env.ELEVENLABS_VOICE_ID || "WQcQveC0hbQNvI69FWyU";

  const res = await fetch(`${ELEVENLABS_API_BASE}/text-to-speech/${voice}`, {
    method: "POST",
    headers: {
      "xi-api-key": getApiKey(),
      "Content-Type": "application/json",
      Accept: "audio/mpeg",
    },
    body: JSON.stringify({
      text,
      model_id: "eleven_turbo_v2_5",
      voice_settings: {
        stability: 0.6,
        similarity_boost: 0.8,
        style: 0.3,
        use_speaker_boost: true,
      },
    }),
  });

  if (!res.ok) {
    const error = await res.text();
    throw new Error(`ElevenLabs error (${res.status}): ${error}`);
  }

  const arrayBuffer = await res.arrayBuffer();
  return Buffer.from(arrayBuffer);
}

export async function listVoices() {
  const res = await fetch(`${ELEVENLABS_API_BASE}/voices`, {
    headers: { "xi-api-key": getApiKey() },
  });
  return res.json();
}
