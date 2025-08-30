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
  // when true, use compact notation (e.g., Rp 1.4M instead of Rp 1.400.000)
  compact?: boolean;
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
  const useCompact = options.compact ?? false;

  // When using compact notation, we want to show more precision
  // Override fraction digits for compact mode to show decimal places
  let finalMinimumFractionDigits = minimumFractionDigits;
  let finalMaximumFractionDigits = maximumFractionDigits;

  if (useCompact) {
    // For compact mode, be smart about decimal precision
    // Only show decimals if they add meaningful value (not just .0)

    // Check if the value has meaningful decimal places when divided by compact units
    const hasSignificantDecimals = (val: number, divisor: number) => {
      const divided = val / divisor;
      return divided % 1 !== 0; // Has decimal part
    };

    // Determine if we need decimals based on the value
    let needsDecimals = false;

    // For millions (1,000,000+)
    if (Math.abs(value) >= 1000000) {
      needsDecimals = hasSignificantDecimals(value, 1000000);
    }
    // For thousands (1,000+)
    else if (Math.abs(value) >= 1000) {
      needsDecimals = hasSignificantDecimals(value, 1000);
    }

    if (needsDecimals) {
      finalMinimumFractionDigits = 0; // Don't force decimals, let them show naturally
      finalMaximumFractionDigits = Math.max(maximumFractionDigits, 2);
    } else {
      // No meaningful decimals, keep it clean
      finalMinimumFractionDigits = 0;
      finalMaximumFractionDigits = 0;
    }
  }

  const formatOptions: Intl.NumberFormatOptions = {
    style: showCurrency ? 'currency' : 'decimal',
    currency,
    minimumFractionDigits: finalMinimumFractionDigits,
    maximumFractionDigits: finalMaximumFractionDigits,
  };

  // Add compact notation if requested
  if (useCompact) {
    formatOptions.notation = 'compact';
    formatOptions.compactDisplay = 'short';
  }

  const formatter = new Intl.NumberFormat(locale, formatOptions);

  return formatter.format(value);
}
