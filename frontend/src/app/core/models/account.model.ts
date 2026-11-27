export type Role = "Usuario" | "Administrador"

export type Account = {
  id: number
  member: string
  name: string
  last: string
  email: string
  phone: string
  password: string
  role: Role
  active: boolean
  joined: string
}
