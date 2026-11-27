import type { Book, Copy } from "./book.model"
import type { Circle } from "./circle.model"
import type { Loan } from "./loan.model"

/** Modelos de lectura: entidades enriquecidas con datos calculados. */
export type BookView = Book & {
  author: string
  genre: string
  available: boolean
  copiesTotal: number
  copiesFree: number
  rating: number
  reviewCount: number
}
export type LoanStatus = "En curso" | "Atrasado" | "Devuelto"
export type LoanView = Loan & { status: LoanStatus }
export type CopyStatus = "Disponible" | "Prestado" | "Mantenimiento"
export type CopyView = Copy & { status: CopyStatus }
export type CircleView = Circle & { enrolled: number; seatsLeft: number }
