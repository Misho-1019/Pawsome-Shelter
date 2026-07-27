// Parse a URL parameter that should be a positive integer ID.
// Returns null if the value is not a valid positive integer.
export function parseId(id: string | string[] | undefined): number | null {
  if (id === undefined) return null
  const value = Array.isArray(id) ? id[0] : id
  if (!value) return null
  const parsed = parseInt(value, 10)
  if (isNaN(parsed) || parsed <= 0) return null
  return parsed
}
