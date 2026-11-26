import { Injectable, computed, effect, inject, signal } from "@angular/core"
import type { Account, Result, SessionRole } from "../models"
import { iso } from "../utils/date.utils"
import { DatabaseStore, nextId } from "./database.store"
import { UiService } from "./ui.service"

const SESSION_KEY = "biblioteca-session-v2"

/** Sesión, cuentas de usuario y recuperación de contraseña. */
@Injectable({ providedIn: "root" })
export class AuthService {
  private store = inject(DatabaseStore)
  private ui = inject(UiService)

  private userId = signal<number | null>(
    (() => {
      const stored = sessionStorage.getItem(SESSION_KEY)
      return stored ? Number(stored) : null
    })(),
  )

  readonly user = computed(() => this.store.db().accounts.find((a) => a.id === this.userId()) || null)
  readonly role = computed<SessionRole>(() => {
    const u = this.user()
    return !u ? "guest" : u.role === "Administrador" ? "admin" : "user"
  })

  constructor() {
    effect(() => {
      const id = this.userId()
      if (id === null) sessionStorage.removeItem(SESSION_KEY)
      else sessionStorage.setItem(SESSION_KEY, String(id))
    })
  }

  userName(id: number) {
    const a = this.store.db().accounts.find((x) => x.id === id)
    return a ? `${a.name} ${a.last}` : "Usuario eliminado"
  }

  /** Exige sesión; si no hay, redirige a /login conservando la ruta destino. */
  gate(next: string) {
    if (this.role() === "guest") {
      this.ui.notify("Inicia sesión para continuar", "error")
      this.ui.navigate(`/login?next=${encodeURIComponent(next)}`)
      return false
    }
    return true
  }

  login(email: string, password: string): Result & { role?: "user" | "admin" } {
    const found = this.store.db().accounts.find((a) => a.email.toLowerCase() === email.trim().toLowerCase())
    if (!found || !password) return { ok: false, message: "Correo o contraseña incorrectos" }
    if (!found.active) return { ok: false, message: "Esta cuenta está inactiva. Contacta a la biblioteca." }
    this.userId.set(found.id)
    return { ok: true, role: found.role === "Administrador" ? "admin" : "user" }
  }

  logout() {
    this.userId.set(null)
  }

  register(values: Record<string, string>): Result {
    const d = this.store.db()
    if (d.accounts.some((a) => a.email.toLowerCase() === values["email"].toLowerCase()))
      return { ok: false, message: "Ya existe una cuenta con ese correo" }
    const id = nextId(d.accounts)
    const member = String(d.accounts.reduce((m, a) => Math.max(m, Number(a.member) || 0), 2023000) + 1)
    const account: Account = {
      id,
      member,
      name: values["name"],
      last: values["last"],
      email: values["email"],
      phone: values["phone"],
      password: values["password"],
      role: "Usuario",
      active: true,
      joined: iso(),
    }
    this.store.update((x) => ({ ...x, accounts: [...x.accounts, account] }))
    this.userId.set(id)
    return { ok: true }
  }

  updateProfile(patch: Partial<Account>) {
    const u = this.user()
    if (!u) return
    this.store.update((d) => ({ ...d, accounts: d.accounts.map((a) => (a.id === u.id ? { ...a, ...patch } : a)) }))
  }

  // ---------- Recuperación de contraseña ----------
  requestReset(email: string): string | null {
    const found = this.store.db().accounts.find((a) => a.email.toLowerCase() === email.trim().toLowerCase())
    if (!found) return null
    const token = Math.random().toString(36).slice(2, 10)
    this.store.update((d) => ({
      ...d,
      tokens: [
        ...d.tokens,
        { id: nextId(d.tokens), userId: found.id, token, created: iso(), expires: iso(1), used: "" },
      ],
    }))
    return token
  }

  tokenOwner(token: string) {
    const d = this.store.db()
    const t = d.tokens.find((x) => x.token === token && !x.used && x.expires >= this.store.today)
    return t ? d.accounts.find((a) => a.id === t.userId) || null : null
  }

  resetPassword(token: string, password: string): boolean {
    const t = this.store.db().tokens.find((x) => x.token === token && !x.used && x.expires >= this.store.today)
    if (!t) return false
    this.store.update((d) => ({
      ...d,
      accounts: d.accounts.map((a) => (a.id === t.userId ? { ...a, password } : a)),
      tokens: d.tokens.map((x) => (x.id === t.id ? { ...x, used: iso() } : x)),
    }))
    return true
  }

  // ---------- Administración de cuentas ----------
  saveAccount(account: Omit<Account, "id" | "joined"> & { id?: number }): Result {
    const clash = this.store
      .db()
      .accounts.find((a) => a.email.toLowerCase() === account.email.toLowerCase() && a.id !== account.id)
    if (clash) return { ok: false, message: "Ya existe una cuenta con ese correo" }
    this.store.update((d) => ({
      ...d,
      accounts: account.id
        ? d.accounts.map((a) => (a.id === account.id ? { ...a, ...account } : a))
        : [...d.accounts, { ...account, id: nextId(d.accounts), joined: iso() }],
    }))
    return { ok: true }
  }

  toggleAccount(id: number) {
    this.store.update((d) => ({
      ...d,
      accounts: d.accounts.map((a) => (a.id === id ? { ...a, active: !a.active } : a)),
    }))
  }
}
