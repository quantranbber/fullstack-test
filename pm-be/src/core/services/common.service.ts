export const trimString = (raw: string): string => String(raw).trim();

export function escapeWildcards(raw: string, escapeChar = '\\'): string {
  return trimString(raw).replace(/[\\%_]/g, (match) => escapeChar + match);
}

export function getJwtSecretKey() {
  return process.env.JWT_SECRET;
}
