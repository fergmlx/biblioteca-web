/** Fecha ISO (YYYY-MM-DD) con un desplazamiento opcional en días. */
export function iso(offsetDays = 0) {
  const date = new Date()
  date.setHours(12, 0, 0, 0)
  date.setDate(date.getDate() + offsetDays)
  return date.toISOString().slice(0, 10)
}

/** Formato dd/mm/aaaa para mostrar en pantalla. */
export function fmt(value: string) {
  if (!value) return "—"
  const [y, m, d] = value.slice(0, 10).split("-")
  return `${d}/${m}/${y}`
}
