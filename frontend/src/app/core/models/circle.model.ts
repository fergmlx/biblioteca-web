export type Circle = {
  id: number
  name: string
  topic: string
  day: string
  time: string
  capacity: number
  enrolledBase: number
  start: string
  end: string
  description: string
  bookId: number | null
  active: boolean
}

export type Enrollment = {
  id: number
  userId: number
  circleId: number
  date: string
  status: "Pendiente" | "Activa" | "Cancelada"
}
