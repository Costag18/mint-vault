export function formatCurrency(value: string | number | null | undefined): string {
  if (value === null || value === undefined) return "$0.00";
  const num = typeof value === "string" ? parseFloat(value) : value;
  if (isNaN(num)) return "$0.00";
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format(num);
}

export function formatCompactCurrency(
  value: string | number | null | undefined
): string {
  if (value === null || value === undefined) return "$0";
  const num = typeof value === "string" ? parseFloat(value) : value;
  if (isNaN(num)) return "$0";

  if (Math.abs(num) >= 1_000_000) {
    return `$${(num / 1_000_000).toFixed(1)}M`;
  }
  if (Math.abs(num) >= 1_000) {
    return `$${(num / 1_000).toFixed(1)}k`;
  }
  return formatCurrency(num);
}

export const CURRENCY_OPTIONS = {
  CAD: { rate: 1.37, locale: "en-CA", label: "CAD – Canadian Dollar" },
  EUR: { rate: 0.92, locale: "de-DE", label: "EUR – Euro" },
  GBP: { rate: 0.79, locale: "en-GB", label: "GBP – British Pound" },
  AUD: { rate: 1.53, locale: "en-AU", label: "AUD – Australian Dollar" },
  JPY: { rate: 149.5, locale: "ja-JP", label: "JPY – Japanese Yen" },
  MXN: { rate: 17.15, locale: "es-MX", label: "MXN – Mexican Peso" },
  BRL: { rate: 4.97, locale: "pt-BR", label: "BRL – Brazilian Real" },
  INR: { rate: 83.4, locale: "en-IN", label: "INR – Indian Rupee" },
} as const;

export type CurrencyCode = keyof typeof CURRENCY_OPTIONS;

export function convertFromUSD(
  value: string | number | null | undefined,
  currency: CurrencyCode
): string {
  if (value === null || value === undefined) return "";
  const num = typeof value === "string" ? parseFloat(value) : value;
  if (isNaN(num)) return "";
  const { rate, locale } = CURRENCY_OPTIONS[currency];
  const converted = num * rate;
  return new Intl.NumberFormat(locale, {
    style: "currency",
    currency,
    minimumFractionDigits: currency === "JPY" ? 0 : 2,
    maximumFractionDigits: currency === "JPY" ? 0 : 2,
  }).format(converted);
}

export function formatCurrencyCAD(value: string | number | null | undefined): string {
  return convertFromUSD(value, "CAD") || "CA$0.00";
}

export function formatDate(date: Date | string | null | undefined): string {
  if (!date) return "";
  const d = typeof date === "string" ? new Date(date) : date;
  return new Intl.DateTimeFormat("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  }).format(d);
}

export function formatRelativeTime(
  date: Date | string | null | undefined
): string {
  if (!date) return "";
  const d = typeof date === "string" ? new Date(date) : date;
  const now = new Date();
  const diffMs = now.getTime() - d.getTime();
  const diffSeconds = Math.floor(diffMs / 1000);
  const diffMinutes = Math.floor(diffSeconds / 60);
  const diffHours = Math.floor(diffMinutes / 60);
  const diffDays = Math.floor(diffHours / 24);
  const diffWeeks = Math.floor(diffDays / 7);
  const diffMonths = Math.floor(diffDays / 30);
  const diffYears = Math.floor(diffDays / 365);

  if (diffSeconds < 60) return "just now";
  if (diffMinutes < 60) return `${diffMinutes}m ago`;
  if (diffHours < 24) return `${diffHours}h ago`;
  if (diffDays < 7) return `${diffDays}d ago`;
  if (diffWeeks < 5) return `${diffWeeks}w ago`;
  if (diffMonths < 12) return `${diffMonths}mo ago`;
  return `${diffYears}y ago`;
}
