import { type ClassValue, clsx } from "clsx";
import { differenceInHours, differenceInMinutes, format } from "date-fns";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function logWithTimestamp(message: string) {
  const now = new Date();
  const timestamp = `${now.toTimeString().split(" ")[0]}.${now.getMilliseconds().toString().padStart(3, "0")}`;
  console.log(`${timestamp} ${message}`);
}

/**
 * Format a timestamp to a human-readable relative time string
 * @param timestamp - Unix timestamp in milliseconds
 * @returns Formatted string like "moments ago", "5 minutes ago", "3 hours ago", or "Jun 15, 9:34"
 */
export function formatRelativeTime(timestamp: number): string {
  const now = Date.now();
  const date = new Date(timestamp);

  const minutesAgo = differenceInMinutes(now, date);
  const hoursAgo = differenceInHours(now, date);

  if (minutesAgo < 1) {
    return "moments ago";
  }

  if (minutesAgo < 60) {
    return `${minutesAgo} ${minutesAgo === 1 ? "minute" : "minutes"} ago`;
  }

  if (hoursAgo < 24) {
    return `${hoursAgo} ${hoursAgo === 1 ? "hour" : "hours"} ago`;
  }

  // For older dates: "Jun 15, 9:34"
  return format(date, "MMM d, H:mm");
}
