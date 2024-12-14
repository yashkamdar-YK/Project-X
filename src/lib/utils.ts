import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export function handleNameInputChange(input: string): string {
  let formattedInput = input.replace(/\s+/g, "_");
  formattedInput = formattedInput.replace(/[^a-zA-Z0-9_]/g, "");
  return formattedInput;
}