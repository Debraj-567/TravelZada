import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";

/**
 * Robust utility to merge Tailwind classes using clsx and tailwind-merge.
 * Prevents class collisions and handles conditional logic elegantly.
 */
export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}
