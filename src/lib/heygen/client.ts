const HEYGEN_API_BASE = "https://api.heygen.com";

function getApiKey() {
  return process.env.HEYGEN_API_KEY!;
}

export async function heygenFetch(path: string, options: RequestInit = {}) {
  const res = await fetch(`${HEYGEN_API_BASE}${path}`, {
    ...options,
    headers: {
      "X-Api-Key": getApiKey(),
      "Content-Type": "application/json",
      Accept: "application/json",
      ...options.headers,
    },
  });
  return res.json();
}

export async function createVideo({
  script,
  avatarId,
  voiceId,
  title,
  callbackUrl,
}: {
  script: string;
  avatarId: string;
  voiceId: string;
  title?: string;
  callbackUrl?: string;
}) {
  return heygenFetch("/v2/video/generate", {
    method: "POST",
    body: JSON.stringify({
      title: title || "Lesson Video",
      callback_id: callbackUrl,
      video_inputs: [
        {
          character: {
            type: "avatar",
            avatar_id: avatarId,
            avatar_style: "normal",
          },
          voice: {
            type: "text",
            input_text: script,
            voice_id: voiceId,
          },
        },
      ],
      dimension: {
        width: 1920,
        height: 1080,
      },
    }),
  });
}

export async function getVideoStatus(videoId: string) {
  return heygenFetch(`/v1/video_status.get?video_id=${videoId}`);
}

export async function listAvatars() {
  return heygenFetch("/v2/avatars");
}

export async function listVoices() {
  return heygenFetch("/v2/voices");
}
