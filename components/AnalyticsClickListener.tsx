"use client";

import { useEffect } from "react";
import {
  bookTargetFromHref,
  isShowcaseRegisterHref,
  socialPlatformFromUrl,
  trackEvent,
} from "@/lib/analytics";

const GOFUNDME_FUND_PATH = "/f/no-backboard-basketball-gym";

function isWaiverOpenClick(target: EventTarget | null): boolean {
  if (!(target instanceof Element)) {
    return false;
  }

  const anchor = target.closest("a[href]");
  if (anchor instanceof HTMLAnchorElement) {
    const href = anchor.getAttribute("href") ?? "";
    if (/smartwaiver\.com/i.test(href)) {
      return true;
    }
  }

  return Boolean(
    target.closest(
      '#smartwaiver_floater, [id*="smartwaiver"], [class*="smartwaiver"]',
    ),
  );
}

function handleAnchorClick(anchor: HTMLAnchorElement): void {
  const href = anchor.getAttribute("href");
  if (!href || href.startsWith("mailto:") || href.startsWith("tel:")) {
    return;
  }

  const base = window.location.href;

  const book = bookTargetFromHref(href, base);
  if (book.isBook) {
    trackEvent("book_click", {
      package: book.packageId ?? "none",
    });
    return;
  }

  if (isShowcaseRegisterHref(href, base)) {
    trackEvent("showcase_register_click");
    return;
  }

  let url: URL;
  try {
    url = new URL(href, base);
  } catch {
    return;
  }

  const host = url.hostname.replace(/^www\./, "").toLowerCase();
  if (host === "gofundme.com" && url.pathname.includes(GOFUNDME_FUND_PATH)) {
    trackEvent("gofundme_click");
    return;
  }

  const platform = socialPlatformFromUrl(url);
  if (platform && url.origin !== window.location.origin) {
    trackEvent("outbound_social_click", { platform });
  }
}

export default function AnalyticsClickListener() {
  useEffect(() => {
    function onClick(event: MouseEvent) {
      if (event.defaultPrevented) {
        return;
      }

      if (isWaiverOpenClick(event.target)) {
        trackEvent("waiver_open");
        return;
      }

      const target = event.target;
      if (!(target instanceof Element)) {
        return;
      }

      const anchor = target.closest("a[href]");
      if (anchor instanceof HTMLAnchorElement) {
        handleAnchorClick(anchor);
      }
    }

    document.addEventListener("click", onClick, true);
    return () => document.removeEventListener("click", onClick, true);
  }, []);

  return null;
}
