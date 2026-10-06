type EventParams = Record<string, string | number | undefined>;

declare global {
  interface Window {
    gtag?: (...args: unknown[]) => void;
  }
}

export function isGaConfigured(): boolean {
  const id = process.env.NEXT_PUBLIC_GA_MEASUREMENT_ID;
  return Boolean(id && id.trim().length > 0);
}

/** Sends a GA4 custom event when measurement ID is configured; otherwise no-op. */
export function trackEvent(name: string, params?: EventParams): void {
  if (typeof window === "undefined" || !isGaConfigured()) {
    return;
  }

  const cleaned: Record<string, string | number> = {};
  if (params) {
    for (const [key, value] of Object.entries(params)) {
      if (value !== undefined && value !== "") {
        cleaned[key] = value;
      }
    }
  }

  window.gtag?.("event", name, cleaned);
}

export function socialPlatformFromUrl(url: URL): string | undefined {
  const host = url.hostname.replace(/^www\./, "").toLowerCase();

  const map: Record<string, string> = {
    "instagram.com": "instagram",
    "tiktok.com": "tiktok",
    "youtube.com": "youtube",
    "youtu.be": "youtube",
    "facebook.com": "facebook",
    "fb.com": "facebook",
    "linkedin.com": "linkedin",
    "x.com": "x",
    "twitter.com": "x",
  };

  for (const [domain, platform] of Object.entries(map)) {
    if (host === domain || host.endsWith(`.${domain}`)) {
      return platform;
    }
  }

  return undefined;
}

export function bookTargetFromHref(
  href: string,
  baseUrl: string,
): { isBook: boolean; packageId?: string } {
  try {
    const url = new URL(href, baseUrl);
    const hash = url.hash.replace(/^#/, "");
    if (hash !== "book") {
      return { isBook: false };
    }
    const packageId = url.searchParams.get("package") ?? undefined;
    return { isBook: true, packageId: packageId ?? undefined };
  } catch {
    return { isBook: false };
  }
}

export function isShowcaseRegisterHref(href: string, baseUrl: string): boolean {
  try {
    const url = new URL(href, baseUrl);
    return url.hash.replace(/^#/, "") === "showcase-register";
  } catch {
    return false;
  }
}
