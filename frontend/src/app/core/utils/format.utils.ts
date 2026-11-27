export function initials(name: string, last: string) {
  return `${name[0] || ""}${last[0] || ""}`.toUpperCase()
}
