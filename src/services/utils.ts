/**
 * Utility Functions Module
 * 
 * Provides common formatting utilities for the application including
 * currency formatting, time display, and other data presentation helpers.
 * Centralizes formatting logic for consistency across components.
 */

/**
 * Format price values as USD currency
 * 
 * Converts numeric price values to properly formatted US dollar strings
 * using the Intl.NumberFormat API for localization support.
 * 
 * @param price - Numeric price value to format
 * @returns Formatted currency string (e.g., "$25.00")
 */
export const formatPrice = (price: number): string => {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',           // Currency formatting style
    currency: 'USD',             // US Dollar currency
    minimumFractionDigits: 2     // Always show cents
  }).format(price);
};

/**
 * Format time from 24-hour to 12-hour format with AM/PM
 * 
 * Converts time strings from 24-hour format (HH:MM) to 12-hour format
 * with AM/PM indicators for better user readability.
 * 
 * @param time - Time string in 24-hour format (e.g., "14:30")
 * @returns Formatted time string in 12-hour format (e.g., "2:30 PM")
 */
export const formatTime = (time: string): string => {
  const [hours, minutes] = time.split(':');
  const hour24 = parseInt(hours);
  const ampm = hour24 >= 12 ? 'PM' : 'AM';        // Determine AM/PM
  const hour12 = hour24 % 12 || 12;               // Convert to 12-hour format
  return `${hour12}:${minutes} ${ampm}`;
};

// Export utility functions for use throughout the application
export default { formatPrice, formatTime };