export interface SessionPackage {
  id: string;
  name: string;
  priceCents: number;
  category: "school" | "club";
}

export const SESSION_PACKAGES: SessionPackage[] = [
  {
    id: "school-eval",
    name: "Four Session Development Evaluation",
    priceCents: 170_000,
    category: "school",
  },
  {
    id: "school-weekly",
    name: "12 Week Weekly Residency",
    priceCents: 480_000,
    category: "school",
  },
  {
    id: "school-twice-weekly",
    name: "12 Week Twice Weekly Residency",
    priceCents: 960_000,
    category: "school",
  },
  {
    id: "club-2hr",
    name: "Two Hour Team Session",
    priceCents: 56_000,
    category: "club",
  },
  {
    id: "club-2-session",
    name: "Two Session Development Cycle",
    priceCents: 100_000,
    category: "club",
  },
  {
    id: "club-4-session",
    name: "Four Session Development Cycle",
    priceCents: 190_000,
    category: "club",
  },
];

export const SHOWCASE_PRODUCT = {
  id: "showcase-entry",
  name: "NBBL Club Team Showcase Entry",
  priceCents: 36_000,
};

export function getSessionPackage(packageId: string): SessionPackage | undefined {
  return SESSION_PACKAGES.find((pkg) => pkg.id === packageId);
}

export function formatPrice(priceCents: number): string {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(priceCents / 100);
}

export function formatPriceDecimal(priceCents: number): string {
  return (priceCents / 100).toFixed(2);
}

const PAYPAL_PAYMENT_LINKS: Record<string, string> = {
  "school-eval": "https://www.paypal.com/ncp/payment/95RWH63GX8Z3Y",
  "school-weekly": "https://www.paypal.com/ncp/payment/TFAY67MV7EVCC",
  "school-twice-weekly": "https://www.paypal.com/ncp/payment/NT9X7CXE9C368",
  "club-2hr": "https://www.paypal.com/ncp/payment/ZSGTZXNMPHY5U",
  "club-2-session": "https://www.paypal.com/ncp/payment/P3YVVBG2KYK2G",
  "club-4-session": "https://www.paypal.com/ncp/payment/2GK3LNC8B7KDQ",
  "showcase-entry": "https://www.paypal.com/ncp/payment/ZUMYH7N9GNDX6",
};

const PAYPAL_LINK_ENV_KEYS: Record<string, string> = {
  "school-eval": "NEXT_PUBLIC_PAYPAL_LINK_SCHOOL_EVAL",
  "school-weekly": "NEXT_PUBLIC_PAYPAL_LINK_SCHOOL_WEEKLY",
  "school-twice-weekly": "NEXT_PUBLIC_PAYPAL_LINK_SCHOOL_TWICE_WEEKLY",
  "club-2hr": "NEXT_PUBLIC_PAYPAL_LINK_CLUB_2HR",
  "club-2-session": "NEXT_PUBLIC_PAYPAL_LINK_CLUB_2_SESSION",
  "club-4-session": "NEXT_PUBLIC_PAYPAL_LINK_CLUB_4_SESSION",
  "showcase-entry": "NEXT_PUBLIC_PAYPAL_LINK_SHOWCASE",
};

function isPayPalHost(hostname: string): boolean {
  return (
    hostname === "paypal.com" ||
    hostname.endsWith(".paypal.com") ||
    hostname === "sandbox.paypal.com" ||
    hostname.endsWith(".sandbox.paypal.com")
  );
}

export function getPayPalPaymentLink(productId: string): string | null {
  const envKey = PAYPAL_LINK_ENV_KEYS[productId];
  const fromEnv = envKey ? process.env[envKey]?.trim() : undefined;
  const value =
    fromEnv && !fromEnv.startsWith("YOUR_")
      ? fromEnv
      : PAYPAL_PAYMENT_LINKS[productId];

  if (!value) {
    return null;
  }

  try {
    const url = new URL(value);
    if (url.protocol !== "https:" || !isPayPalHost(url.hostname)) {
      return null;
    }
    return url.toString();
  } catch {
    return null;
  }
}

export function isPayPalPaymentLinkConfigured(productId: string): boolean {
  return getPayPalPaymentLink(productId) !== null;
}
