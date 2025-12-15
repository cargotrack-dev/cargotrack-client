// src/utils/formatters.ts

/**
 * Format a date string to a localized format
 * @param dateString ISO date string
 * @param locale Locale code (defaults to en-US)
 * @returns Formatted date string
 */
export function formatDate(dateString: string, locale: string = 'en-US'): string {
    try {
      const date = new Date(dateString);
      return new Intl.DateTimeFormat(locale, {
        year: 'numeric',
        month: 'short',
        day: 'numeric'
      }).format(date);
    } catch (error) {
      console.error('Error formatting date:', error);
      return dateString; // Return original string if formatting fails
    }
  }
  
  /**
   * Format a number as currency
   * @param amount The amount to format
   * @param currencyCode ISO 4217 currency code (defaults to USD)
   * @param locale Locale code (defaults to en-US)
   * @returns Formatted currency string
   */
  export function formatCurrency(
    amount: number, 
    currencyCode: string = 'USD', 
    locale: string = 'en-US'
  ): string {
    try {
      return new Intl.NumberFormat(locale, {
        style: 'currency',
        currency: currencyCode,
        minimumFractionDigits: 2,
        maximumFractionDigits: 2
      }).format(amount);
    } catch (error) {
      console.error('Error formatting currency:', error);
      return `${currencyCode} ${amount.toFixed(2)}`; // Fallback format
    }
  }
  
  /**
   * Format a number with specified decimal places
   * @param value Number to format
   * @param decimalPlaces Number of decimal places
   * @param locale Locale code (defaults to en-US)
   * @returns Formatted number string
   */
  export function formatNumber(
    value: number, 
    decimalPlaces: number = 2, 
    locale: string = 'en-US'
  ): string {
    try {
      return new Intl.NumberFormat(locale, {
        minimumFractionDigits: decimalPlaces,
        maximumFractionDigits: decimalPlaces
      }).format(value);
    } catch (error) {
      console.error('Error formatting number:', error);
      return value.toFixed(decimalPlaces); // Fallback format
    }
  }