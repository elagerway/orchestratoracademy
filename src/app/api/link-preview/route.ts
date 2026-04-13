import { NextRequest, NextResponse } from "next/server";

export async function GET(req: NextRequest) {
  const url = req.nextUrl.searchParams.get("url");
  if (!url) {
    return NextResponse.json({ error: "Missing url" }, { status: 400 });
  }

  // Validate URL and block private/internal addresses
  try {
    const parsed = new URL(url);
    if (!["http:", "https:"].includes(parsed.protocol)) {
      return NextResponse.json({ error: "Invalid URL" }, { status: 400 });
    }
    const hostname = parsed.hostname;
    const blocked = /^(localhost|127\.|10\.|192\.168\.|172\.(1[6-9]|2\d|3[01])\.|169\.254\.|0\.0\.0\.0|\[::1\])/.test(hostname);
    if (blocked) {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 });
    }
  } catch {
    return NextResponse.json({ error: "Invalid URL" }, { status: 400 });
  }

  try {
    const res = await fetch(url, {
      headers: { "User-Agent": "bot" },
      signal: AbortSignal.timeout(5000),
    });

    if (!res.ok) {
      return NextResponse.json({}, { status: 200 });
    }

    const contentType = res.headers.get("content-type") ?? "";
    if (!contentType.includes("text/html")) {
      return NextResponse.json({}, { status: 200 });
    }

    const html = await res.text();

    function getMetaContent(property: string): string | undefined {
      // Match og: and twitter: meta tags
      const patterns = [
        new RegExp(
          `<meta[^>]*property=["']${property}["'][^>]*content=["']([^"']*)["']`,
          "i"
        ),
        new RegExp(
          `<meta[^>]*content=["']([^"']*)["'][^>]*property=["']${property}["']`,
          "i"
        ),
        new RegExp(
          `<meta[^>]*name=["']${property}["'][^>]*content=["']([^"']*)["']`,
          "i"
        ),
        new RegExp(
          `<meta[^>]*content=["']([^"']*)["'][^>]*name=["']${property}["']`,
          "i"
        ),
      ];
      for (const pattern of patterns) {
        const match = html.match(pattern);
        if (match?.[1]) return match[1];
      }
      return undefined;
    }

    const title =
      getMetaContent("og:title") ??
      getMetaContent("twitter:title") ??
      html.match(/<title[^>]*>([^<]*)<\/title>/i)?.[1]?.trim();

    const description =
      getMetaContent("og:description") ??
      getMetaContent("twitter:description") ??
      getMetaContent("description");

    let image =
      getMetaContent("og:image") ?? getMetaContent("twitter:image");

    // Resolve relative image URLs
    if (image && !image.startsWith("http")) {
      try {
        image = new URL(image, url).href;
      } catch {
        image = undefined;
      }
    }

    return NextResponse.json(
      { title, description, image },
      {
        status: 200,
        headers: { "Cache-Control": "public, max-age=86400" },
      }
    );
  } catch {
    return NextResponse.json({}, { status: 200 });
  }
}
