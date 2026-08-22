export function isValidEmail(email: string): boolean {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
}

export function parseJsonBody<T>(body: unknown): T | null {
  if (!body || typeof body !== "object") {
    return null;
  }
  return body as T;
}

export function getStringField(
  record: Record<string, unknown>,
  key: string,
): string {
  const value = record[key];
  return typeof value === "string" ? value.trim() : "";
}

export function getOptionalStringField(
  record: Record<string, unknown>,
  key: string,
): string | undefined {
  const value = getStringField(record, key);
  return value || undefined;
}

export function requireFields(
  record: Record<string, unknown>,
  keys: string[],
): string | null {
  for (const key of keys) {
    if (!getStringField(record, key)) {
      return `Missing required field: ${key}`;
    }
  }
  return null;
}

export function validateEmailField(
  record: Record<string, unknown>,
  key = "email",
): string | null {
  const email = getStringField(record, key);
  if (!email) {
    return `Missing required field: ${key}`;
  }
  if (!isValidEmail(email)) {
    return "Invalid email address";
  }
  return null;
}
