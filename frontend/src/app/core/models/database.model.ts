import type { Account } from "./account.model"
import type { Author } from "./author.model"
import type { Book, Copy } from "./book.model"
import type { Circle, Enrollment } from "./circle.model"
import type { Genre } from "./genre.model"
import type { Loan, LoanRequest } from "./loan.model"
import type { ResetToken } from "./reset-token.model"
import type { Review } from "./review.model"

/** Estructura completa de la "base de datos" local (espejo de las tablas del backend). */
export type Database = {
  books: Book[]
  authors: Author[]
  copies: Copy[]
  accounts: Account[]
  requests: LoanRequest[]
  loans: Loan[]
  circles: Circle[]
  enrollments: Enrollment[]
  reviews: Review[]
  genres: Genre[]
  favorites: Record<number, number[]>
  tokens: ResetToken[]
}
