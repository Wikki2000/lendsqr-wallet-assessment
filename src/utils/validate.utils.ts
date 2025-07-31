export function isMissingFields(
  requiredFields: string[],
  data: Record<string, any>
): string | null {
  for (const field of requiredFields) {
    if (!data[field]) {
      return capitalize(field);
    }
  }
  return null;
}

function capitalize(text: string): string {
  return text.charAt(0).toUpperCase() + text.slice(1);
}
