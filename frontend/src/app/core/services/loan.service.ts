import { Injectable, computed, inject } from "@angular/core"
import type { LoanRequest, LoanView, Result } from "../models"
import { iso } from "../utils/date.utils"
import { AuthService } from "./auth.service"
import { CatalogService } from "./catalog.service"
import { DatabaseStore, nextId } from "./database.store"

/** Solicitudes de préstamo, préstamos, devoluciones y renovaciones. */
@Injectable({ providedIn: "root" })
export class LoanService {
  private store = inject(DatabaseStore)
  private auth = inject(AuthService)
  private catalog = inject(CatalogService)

  readonly loans = computed<LoanView[]>(() =>
    this.store.db().loans.map((loan) => ({
      ...loan,
      status: loan.returned ? "Devuelto" : loan.due < this.store.today ? "Atrasado" : "En curso",
    })),
  )

  requestLoan(bookId: number): Result {
    const u = this.auth.user()
    const d = this.store.db()
    if (!u) return { ok: false, message: "Inicia sesión para solicitar un libro" }
    const book = this.catalog.books().find((b) => b.id === bookId)
    if (!book || !book.available) return { ok: false, message: "Este libro no tiene ejemplares disponibles" }
    if (d.requests.some((r) => r.userId === u.id && r.bookId === bookId && r.status === "Pendiente"))
      return { ok: false, message: "Ya tienes una solicitud pendiente para este libro" }
    if (d.loans.some((l) => l.userId === u.id && l.bookId === bookId && !l.returned))
      return { ok: false, message: "Ya tienes este libro en préstamo" }
    const request: LoanRequest = {
      id: nextId(d.requests),
      userId: u.id,
      bookId,
      date: iso(),
      status: "Pendiente",
      answered: "",
      notes: "",
    }
    this.store.update((x) => ({ ...x, requests: [...x.requests, request] }))
    return { ok: true }
  }

  cancelRequest(id: number) {
    this.store.update((d) => ({
      ...d,
      requests: d.requests.map((r) => (r.id === id ? { ...r, status: "Cancelada", answered: iso() } : r)),
    }))
  }

  resolveRequest(id: number, approve: boolean, notes: string, copy?: number): Result {
    const request = this.store.db().requests.find((r) => r.id === id)
    if (!request) return { ok: false }
    if (!approve) {
      this.store.update((d) => ({
        ...d,
        requests: d.requests.map((r) => (r.id === id ? { ...r, status: "Rechazada", answered: iso(), notes } : r)),
      }))
      return { ok: true }
    }
    if (copy === undefined) return { ok: false, message: "Selecciona un ejemplar para asignar" }
    this.store.update((d) => ({
      ...d,
      requests: d.requests.map((r) => (r.id === id ? { ...r, status: "Aprobada", answered: iso(), notes } : r)),
      loans: [
        ...d.loans,
        {
          id: nextId(d.loans),
          userId: request.userId,
          bookId: request.bookId,
          copy,
          date: iso(),
          due: iso(14),
          returned: "",
          requestId: id,
        },
      ],
    }))
    return { ok: true }
  }

  registerLoan(userId: number, bookId: number, copy: number, days: number): Result {
    const target = this.store.db().accounts.find((a) => a.id === userId)
    if (!target?.active) return { ok: false, message: "La cuenta del usuario está inactiva" }
    this.store.update((d) => ({
      ...d,
      loans: [
        ...d.loans,
        { id: nextId(d.loans), userId, bookId, copy, date: iso(), due: iso(days), returned: "", requestId: null },
      ],
    }))
    return { ok: true }
  }

  returnLoan(id: number) {
    this.store.update((d) => ({ ...d, loans: d.loans.map((l) => (l.id === id ? { ...l, returned: iso() } : l)) }))
  }

  renewLoan(id: number) {
    this.store.update((d) => ({
      ...d,
      loans: d.loans.map((l) =>
        l.id === id ? { ...l, due: new Date(new Date(l.due).getTime() + 7 * 86400000).toISOString().slice(0, 10) } : l,
      ),
    }))
  }
}
