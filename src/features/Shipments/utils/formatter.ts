// src/features/Shipments/utils/formatter.ts

/**
 * Utility functions for formatting data in the Shipments feature
 */

/**
 * Format a date to a string representation
 * @param date Date or date string to format
 * @param format Optional format string (default: 'MMM d, yyyy')
 * @returns Formatted date string
 */
export const formatDate = (date: Date | string, format: string = 'MMM d, yyyy'): string => {
    if (!date) return 'N/A';
    
    try {
      const dateObj = typeof date === 'string' ? new Date(date) : date;
      
      // Check if the date is valid
      if (isNaN(dateObj.getTime())) {
        return 'Invalid Date';
      }
      
      // Simple format parsing
      format = format.replace('yyyy', dateObj.getFullYear().toString());
      format = format.replace('MM', (dateObj.getMonth() + 1).toString().padStart(2, '0'));
      format = format.replace('dd', dateObj.getDate().toString().padStart(2, '0'));
      
      // Month names
      const monthNames = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
      format = format.replace('MMM', monthNames[dateObj.getMonth()]);
      
      return format;
    } catch (error) {
      console.error('Error formatting date:', error);
      return 'Error';
    }
  };
  
  /**
   * Format a number as currency
   * @param amount Number to format as currency
   * @param currency Currency code (default: 'USD')
   * @returns Formatted currency string
   */
  export const formatCurrency = (amount: number, currency: string = 'USD'): string => {
    if (amount === undefined || amount === null) {
      return 'N/A';
    }
    
    try {
      return new Intl.NumberFormat('en-US', {
        style: 'currency',
        currency: currency,
        minimumFractionDigits: 2,
        maximumFractionDigits: 2
      }).format(amount);
    } catch (error) {
      console.error('Error formatting currency:', error);
      return `${amount}`;
    }
  };
  
  /**
   * Format a weight value with its unit
   * @param value Weight value
   * @param unit Weight unit (kg, lb, etc.)
   * @returns Formatted weight string
   */
  export const formatWeight = (value: number, unit: string): string => {
    if (value === undefined || value === null) {
      return 'N/A';
    }
    
    return `${value.toLocaleString()} ${unit}`;
  };