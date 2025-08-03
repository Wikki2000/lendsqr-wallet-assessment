export function isMissingFields(
  requiredFields: string[],
  data: Record<string, any>
): string | null {
  if (!requiredFields || !data) {
    return null;
  }
  for (const field of requiredFields) {
    if (!data[field]) {
      return capitalize(field);
    }
  }
  return null;
}

export function isValidAmount(amount: any): { valid: boolean; message?: string } {
  if (!amount || isNaN(amount)) {
    return { valid: false, message: 'Amount must be a number' };
  }

  if (Number(amount) <= 0) {
    return { valid: false, message: 'Amount must be a positive number' };
  }

  return { valid: true };
}

function capitalize(text: string): string {
  return text.charAt(0).toUpperCase() + text.slice(1);
}
