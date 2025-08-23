/**
 * Price formatting helper inspired by the project's `date.ts` style.
 * Usage: formatPrice(1000, Currency.IDR) or formatPrice('1.000', Currency.IDR)
 */

export const enum Currency {
  IDR = 'IDR',
  USD = 'USD',
  EUR = 'EUR',
  GBP = 'GBP',
}

export type CurrencyType = (typeof Currency)[keyof typeof Currency];

export interface FormatPriceOptions {
  // locale is fixed to 'id-ID' for this project and cannot be changed
  minimumFractionDigits?: number;
  maximumFractionDigits?: number;
  // when false, omit the currency symbol and just show the number
  showCurrencySymbol?: boolean;
}

function sanitizeAmount(amount: number | string | null | undefined): number {
  if (amount === null || amount === undefined) {
    throw new Error('Amount is required');
  }

  if (typeof amount === 'number') return amount;
  if (typeof amount !== 'string') {
    throw new Error('Amount must be a number or string');
  }

  // Remove common thousand separators (commas or dots) but keep decimal dot
  // We'll try to detect if the string uses comma as decimal separator (e.g. "1.234,56")
  const hasComma = amount.indexOf(',') !== -1;
  const hasDot = amount.indexOf('.') !== -1;

  let normalized = amount.trim();

  // If both dot and comma exist, assume dot is thousand separator and comma is decimal (common in Europe)
  if (hasDot && hasComma) {
    // remove dots then replace comma with dot
    normalized = normalized.replace(/\./g, '').replace(/,/g, '.');
  } else {
    // remove any non-digit, non-dot, non-minus (this removes thousand separators)
    normalized = normalized.replace(/[^0-9.-]+/g, '');
  }

  const parsed = parseFloat(normalized);
  if (Number.isNaN(parsed)) throw new Error('Invalid amount string provided');
  return parsed;
}

/**
 * Formats a numeric amount into a localized currency string.
 * Defaults: IDR -> 'id-ID' locale and 0 fraction digits.
 */
export function formatPrice(
  amount: number | string | null | undefined,
  currency: CurrencyType = Currency.IDR,
  options: FormatPriceOptions = {},
): string {
  const value = sanitizeAmount(amount);

  // Locale is always Indonesian for this project
  const locale = 'id-ID';

  // Default fraction digits: IDR uses 0, others commonly use 2
  const defaultFraction = currency === Currency.IDR ? 0 : 2;
  const minimumFractionDigits =
    options.minimumFractionDigits ?? defaultFraction;
  const maximumFractionDigits =
    options.maximumFractionDigits ?? defaultFraction;

  const showCurrency = options.showCurrencySymbol ?? true;

  const formatter = new Intl.NumberFormat(locale, {
    style: showCurrency ? 'currency' : 'decimal',
    currency,
    minimumFractionDigits,
    maximumFractionDigits,
  } as Intl.NumberFormatOptions);

  return formatter.format(value);
}
