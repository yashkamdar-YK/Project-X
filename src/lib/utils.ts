import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export function validateName(input: string): string {
  let formattedInput = input.replace(/\s+/g, "_");
  formattedInput = formattedInput.replace(/[^a-zA-Z0-9_]/g, "");
  return formattedInput;
}

export function convertToMinutes(timeStr: string): number {
  const value = parseInt(timeStr);
  const unit = timeStr.slice(-1).toLowerCase();
  
  if (unit === 'h') {
      return value * 60;
  } else if (unit === 'm') {
      return value;
  } else {
      throw new Error('Invalid time format. Use m for minutes or h for hours');
  }
}