const DEFAULT_MAX_CACHE_BYTES = 256 * 1024;

const compactCacheValue = (_key: string, value: unknown): unknown => {
  if (typeof value !== 'string') return value;
  if (value.startsWith('data:') || value.startsWith('blob:')) return undefined;
  return value.length > 16_384 ? undefined : value;
};

export const readJsonCache = <T>(key: string): T | null => {
  if (typeof localStorage === 'undefined') return null;
  try {
    const stored = localStorage.getItem(key);
    return stored ? (JSON.parse(stored) as T) : null;
  } catch {
    localStorage.removeItem(key);
    return null;
  }
};

export const writeCompactJsonCache = (
  key: string,
  value: unknown,
  maxBytes = DEFAULT_MAX_CACHE_BYTES
): boolean => {
  if (typeof localStorage === 'undefined') return false;
  try {
    const serialized = JSON.stringify(value, compactCacheValue);
    if (serialized.length * 2 > maxBytes) {
      localStorage.removeItem(key);
      return false;
    }
    localStorage.setItem(key, serialized);
    return true;
  } catch {
    // Cache failures must never block authoritative persistence.
    localStorage.removeItem(key);
    return false;
  }
};

