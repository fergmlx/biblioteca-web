export type Book = {
  id: number
  title: string
  authorIds: number[]
  genres: string[]
  language: string
  year: number
  isbn: string
  publisher: string
  color: string
  description: string
  active: boolean
}

export type Copy = {
  bookId: number
  number: number
  code: string
  location: string
  condition: "Bueno" | "Regular" | "Dañado"
}
