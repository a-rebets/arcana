import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function logWithTimestamp(message: string) {
  const now = new Date();
  const timestamp = `${now.toTimeString().split(" ")[0]}.${now.getMilliseconds().toString().padStart(3, "0")}`;
  console.log(`${timestamp} ${message}`);
}
