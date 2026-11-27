export type Result = { ok: boolean; message?: string }
export type Toast = { id: number; message: string; type: "success" | "error" }
export type AskOptions = {
  title: string
  message?: string
  confirmLabel?: string
  tone?: "default" | "danger"
}
export type SessionRole = "guest" | "user" | "admin"
