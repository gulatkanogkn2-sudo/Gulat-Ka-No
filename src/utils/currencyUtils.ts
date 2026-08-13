import { systemSettingsService } from '../services/systemSettingsService';

/**
 * Retrieves the current configured system USD to PHP exchange rate.
 * Falls back to 57.08 if unconfigured.
 */
export function getSystemExchangeRate(): number {
  try {
    const settings = systemSettingsService.getSettings();
    const rate = settings?.general?.usdToPhpExchangeRate;
    if (typeof rate === 'number' && rate > 0) {
      return rate;
    }
  } catch {
    // Return standard fallback if settings context not available
  }
  return 57.08333333;
}

/**
 * Retrieves the global price markup percentage from system settings.
 */
export function getSystemMarkupPercent(): number {
  try {
    const settings = systemSettingsService.getSettings();
    const markup = settings?.general?.currencyMarkupPercent;
    if (typeof markup === 'number') {
      return markup;
    }
  } catch {
    // Return standard fallback
  }
  return 0;
}

/**
 * Converts a base USD amount to Philippine Peso (PHP) using system exchange rate and optional markup.
 */
export function convertUsdToPhp(
  usdAmount: number,
  customRate?: number,
  customMarkupPercent?: number
): number {
  if (typeof usdAmount !== 'number' || isNaN(usdAmount)) return 0;
  const rate = typeof customRate === 'number' && customRate > 0 ? customRate : getSystemExchangeRate();
  const markup = typeof customMarkupPercent === 'number' ? customMarkupPercent : getSystemMarkupPercent();
  
  const basePhp = usdAmount * rate;
  if (markup > 0) {
    return basePhp * (1 + markup / 100);
  }
  return basePhp;
}

/**
 * Converts a PHP amount to USD using system exchange rate.
 */
export function convertPhpToUsd(
  phpAmount: number,
  customRate?: number
): number {
  if (typeof phpAmount !== 'number' || isNaN(phpAmount)) return 0;
  const rate = typeof customRate === 'number' && customRate > 0 ? customRate : getSystemExchangeRate();
  return rate > 0 ? phpAmount / rate : 0;
}

/**
 * Formats a PHP amount as primary currency string e.g. "₱ 6,850.00"
 */
export function formatPhpAmount(amount: number): string {
  if (typeof amount !== 'number' || isNaN(amount)) return '₱ 0.00';
  const rounded = Math.round(amount * 100) / 100;
  const formatted = rounded.toLocaleString('en-US', {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  });
  return `₱ ${formatted}`;
}

/**
 * Formats a USD amount as secondary currency string e.g. "$120.00 USD"
 */
export function formatUsdAmount(amount: number): string {
  if (typeof amount !== 'number' || isNaN(amount)) return '$0.00 USD';
  const rounded = Math.round(amount * 100) / 100;
  const formatted = rounded.toLocaleString('en-US', {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  });
  return `$${formatted} USD`;
}
