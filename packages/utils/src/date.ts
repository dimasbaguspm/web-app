import dayjs from 'dayjs';
import advancedFormat from 'dayjs/plugin/advancedFormat';
import localizedFormat from 'dayjs/plugin/localizedFormat';
import relativeTime from 'dayjs/plugin/relativeTime';

// Configure dayjs plugins
dayjs.extend(relativeTime);
dayjs.extend(advancedFormat);
dayjs.extend(localizedFormat);

/**
 * Date format types enum for type safety
 */
const DateFormat = {
  // Relative/Humanized formats
  RELATIVE: 'relative',
  RELATIVE_FROM_NOW: 'relativeFromNow',
  TIME_AGO: 'timeAgo',

  // Common readable formats
  FULL_DATE: 'fullDate',
  SHORT_DATE: 'shortDate',
  MEDIUM_DATE: 'mediumDate',
  LONG_DATE: 'longDate',

  // Date with time
  FULL_DATETIME: 'fullDateTime',
  SHORT_DATETIME: 'shortDateTime',

  // Time only
  TIME_12H: 'time12h',
  TIME_24H: 'time24h',

  // ISO formats
  ISO_DATE: 'isoDate',
  ISO_DATETIME: 'isoDateTime',

  // Custom readable formats
  FRIENDLY_DATE: 'friendlyDate',
  COMPACT_DATE: 'compactDate',
  WEEKDAY_DATE: 'weekdayDate',
  MONTH_YEAR: 'monthYear',
} as const;

export type DateFormatType = (typeof DateFormat)[keyof typeof DateFormat];

/**
 * Formats a date using various humanized and readable formats
 * @param date - The date to format (Date object or string)
 * @param format - The format type to use
 * @returns Formatted date string
 */
export function formatDate(
  date: Date | string,
  format: DateFormatType,
): string {
  const dayjsDate = dayjs(date);

  if (!dayjsDate.isValid()) {
    throw new Error('Invalid date provided');
  }

  switch (format) {
    // Relative/Humanized formats
    case DateFormat.RELATIVE:
      return dayjsDate.fromNow(); // "2 hours ago", "in 3 days"

    case DateFormat.RELATIVE_FROM_NOW:
      return dayjsDate.fromNow(true); // "2 hours", "3 days" (without "ago" or "in")

    case DateFormat.TIME_AGO:
      return dayjsDate.fromNow(); // Same as relative but more explicit naming

    // Common readable formats
    case DateFormat.FULL_DATE:
      return dayjsDate.format('dddd, MMMM D, YYYY'); // "Monday, January 15, 2024"

    case DateFormat.SHORT_DATE:
      return dayjsDate.format('MM/DD/YYYY'); // "01/15/2024"

    case DateFormat.MEDIUM_DATE:
      return dayjsDate.format('MMM D, YYYY'); // "Jan 15, 2024"

    case DateFormat.LONG_DATE:
      return dayjsDate.format('MMMM D, YYYY'); // "January 15, 2024"

    // Date with time
    case DateFormat.FULL_DATETIME:
      return dayjsDate.format('dddd, MMMM D, YYYY [at] h:mm A'); // "Monday, January 15, 2024 at 2:30 PM"

    case DateFormat.SHORT_DATETIME:
      return dayjsDate.format('MM/DD/YYYY h:mm A'); // "01/15/2024 2:30 PM"

    // Time only
    case DateFormat.TIME_12H:
      return dayjsDate.format('h:mm A'); // "2:30 PM"

    case DateFormat.TIME_24H:
      return dayjsDate.format('HH:mm'); // "14:30"

    // ISO formats
    case DateFormat.ISO_DATE:
      return dayjsDate.format('YYYY-MM-DD'); // "2024-01-15"

    case DateFormat.ISO_DATETIME:
      return dayjsDate.toISOString(); // "2024-01-15T14:30:00.000Z"

    // Custom readable formats
    case DateFormat.FRIENDLY_DATE: {
      const now = dayjs();
      const diffDays = now.diff(dayjsDate, 'day');

      if (diffDays === 0) return 'Today';
      if (diffDays === 1) return 'Yesterday';
      if (diffDays === -1) return 'Tomorrow';
      if (diffDays > 0 && diffDays <= 7) return dayjsDate.fromNow();
      return dayjsDate.format('MMM D, YYYY');
    }

    case DateFormat.COMPACT_DATE:
      return dayjsDate.format('M/D/YY'); // "1/15/24"

    case DateFormat.WEEKDAY_DATE:
      return dayjsDate.format('dddd, MMM D'); // "Monday, Jan 15"

    case DateFormat.MONTH_YEAR:
      return dayjsDate.format('MMMM YYYY'); // "January 2024"

    default:
      throw new Error(`Unsupported date format: ${format}`);
  }
}
