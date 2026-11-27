/** Utilidades de búsqueda y exportación del área de administración. */
export const norm = (text: string) =>
  text
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")

export const matches = (text: string, query: string) => norm(text).includes(norm(query.trim()))

export function downloadCsv(filename: string, header: string[], rows: (string | number)[][]) {
  const esc = (value: string | number) => `"${String(value).replace(/"/g, '""')}"`
  const content = "\ufeff" + [header, ...rows].map((r) => r.map(esc).join(",")).join("\n")
  const url = URL.createObjectURL(new Blob([content], { type: "text/csv" }))
  const link = document.createElement("a")
  link.href = url
  link.download = filename
  link.click()
  URL.revokeObjectURL(url)
}
