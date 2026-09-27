/**
 * Deterministic number formatting utility to prevent SSR vs Client hydration mismatch
 * across various server and browser regional locales.
 */
export function formatNumber(num: number | undefined | null): string {
  if (num === undefined || num === null || isNaN(num)) return '0';
  const rounded = Math.round(num);
  return rounded.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ',');
}

export function formatDecimal(num: number | undefined | null, decimals: number = 1): string {
  if (num === undefined || num === null || isNaN(num)) return '0.0';
  return Number(num).toFixed(decimals);
}
