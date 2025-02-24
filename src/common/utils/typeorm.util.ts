export function getCacheKey(key: string, id: string): string {
  return `${key}:${id}`;
}
