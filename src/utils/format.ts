import { format, parseISO } from 'date-fns';
import { ko } from 'date-fns/locale';
import {
  DATE_FORMAT,
  TIME_FORMAT,
  DATETIME_FORMAT,
  DISPLAY_DATE_FORMAT,
  DISPLAY_DATETIME_FORMAT,
} from '@/constants';

/**
 * Format a date string to a specified format
 */
export const formatDate = (
  dateString: string | Date,
  formatStr: string = DATE_FORMAT
): string => {
  try {
    const date = typeof dateString === 'string' ? parseISO(dateString) : dateString;
    return format(date, formatStr, { locale: ko });
  } catch {
    return '';
  }
};

/**
 * Format a date string for display (Korean format)
 */
export const formatDisplayDate = (dateString: string | Date): string => {
  return formatDate(dateString, DISPLAY_DATE_FORMAT);
};

/**
 * Format a datetime string for display (Korean format)
 */
export const formatDisplayDateTime = (dateString: string | Date): string => {
  return formatDate(dateString, DISPLAY_DATETIME_FORMAT);
};

/**
 * Format time only
 */
export const formatTime = (dateString: string | Date): string => {
  return formatDate(dateString, TIME_FORMAT);
};

/**
 * Format datetime
 */
export const formatDateTime = (dateString: string | Date): string => {
  return formatDate(dateString, DATETIME_FORMAT);
};

/**
 * Format a number with thousand separators
 */
export const formatNumber = (value: number): string => {
  return new Intl.NumberFormat('ko-KR').format(value);
};

/**
 * Format a number as currency (Korean Won)
 */
export const formatCurrency = (value: number): string => {
  return new Intl.NumberFormat('ko-KR', {
    style: 'currency',
    currency: 'KRW',
    maximumFractionDigits: 0,
  }).format(value);
};

/**
 * Format a number as percentage
 */
export const formatPercent = (value: number, decimals: number = 1): string => {
  return `${value.toFixed(decimals)}%`;
};

/**
 * Format phone number (Korean format)
 */
export const formatPhoneNumber = (phone: string): string => {
  const cleaned = phone.replace(/\D/g, '');
  if (cleaned.length === 11) {
    return cleaned.replace(/(\d{3})(\d{4})(\d{4})/, '$1-$2-$3');
  } else if (cleaned.length === 10) {
    return cleaned.replace(/(\d{3})(\d{3})(\d{4})/, '$1-$2-$3');
  }
  return phone;
};

/**
 * Truncate text with ellipsis
 */
export const truncateText = (text: string, maxLength: number): string => {
  if (text.length <= maxLength) return text;
  return `${text.slice(0, maxLength)}...`;
};
