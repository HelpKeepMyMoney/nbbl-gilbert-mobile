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
    priceCents: 170_000,
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
