export type LoanRequest = {
  id: number
  userId: number
  bookId: number
  date: string
  status: "Pendiente" | "Aprobada" | "Rechazada" | "Cancelada"
  answered: string
  notes: string
}

export type Loan = {
  id: number
  userId: number
  bookId: number
  copy: number
  date: string
  due: string
  returned: string
  requestId: number | null
}
