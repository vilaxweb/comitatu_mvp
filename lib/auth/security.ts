export const MIN_PASSWORD_LENGTH = 10;

const ABSOLUTE_URL_PATTERN = /^[a-zA-Z][a-zA-Z\d+\-.]*:/;

export function isStrongPassword(value: string): boolean {
  if (value.length < MIN_PASSWORD_LENGTH) return false;
  const hasUpper = /[A-Z]/.test(value);
  const hasLower = /[a-z]/.test(value);
  const hasDigit = /\d/.test(value);
  return hasUpper && hasLower && hasDigit;
}

export function getPasswordPolicyMessage(): string {
  return `La contraseña debe tener al menos ${MIN_PASSWORD_LENGTH} caracteres e incluir mayúsculas, minúsculas y un número.`;
}

export function sanitizeInternalPath(value: string | null | undefined, fallback = "/"): string {
  const candidate = (value ?? "").trim();
  if (!candidate) return fallback;
  if (!candidate.startsWith("/")) return fallback;
  if (candidate.startsWith("//")) return fallback;
  if (ABSOLUTE_URL_PATTERN.test(candidate)) return fallback;
  return candidate;
}

export function getCanonicalSiteUrl(): string | null {
  const raw = process.env.NEXT_PUBLIC_SITE_URL ?? process.env.SITE_URL ?? null;
  if (!raw) return null;
  const trimmed = raw.trim().replace(/\/+$/, "");
  if (!trimmed) return null;
  return trimmed;
}
