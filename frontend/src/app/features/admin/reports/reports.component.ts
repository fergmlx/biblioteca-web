import { ButtonComponent } from "@shared/components/button/button.component"
import { EmptyStateComponent } from "@shared/components/empty-state/empty-state.component"
import { StarsComponent } from "@shared/components/stars/stars.component"
import { StatusComponent } from "@shared/components/status/status.component"
import { MiniStatComponent } from "@features/admin/shared/components/mini-stat/mini-stat.component"
import { TableToolbarComponent } from "@features/admin/shared/components/table-toolbar/table-toolbar.component"
import { Component, computed, inject } from "@angular/core"
import { AuthService, CatalogService, CircleService, DatabaseStore, LoanService, UiService } from "@core/services"
import { fmt } from "@core/utils"
import { downloadCsv } from "@features/admin/shared/utils/admin.utils"

@Component({
  selector: "app-reports",
  imports: [ButtonComponent, EmptyStateComponent, StarsComponent, StatusComponent, MiniStatComponent, TableToolbarComponent],
  templateUrl: "./reports.component.html",
})
export class ReportsComponent {
  ui = inject(UiService)
  auth = inject(AuthService)
  catalog = inject(CatalogService)
  loanService = inject(LoanService)
  circleService = inject(CircleService)
  store = inject(DatabaseStore)
  fmt = fmt
  bookTitle(id: number) {
    return this.store.db().books.find((b) => b.id === id)?.title || "Libro eliminado"
  }
  loanRows = computed(() => [...this.loanService.loans()].sort((a, b) => b.id - a.id))
  ranking = computed(() =>
    this.catalog
      .books()
      .map((b) => ({
        ...b,
        loans: this.store.db().loans.filter((l) => l.bookId === b.id).length,
        requests: this.store.db().requests.filter((r) => r.bookId === b.id).length,
      }))
      .sort((a, b) => b.loans - a.loans || b.requests - a.requests),
  )
  topRated = computed(() =>
    this.catalog
      .books()
      .filter((b) => b.reviewCount > 0)
      .sort((a, b) => b.rating - a.rating)
      .slice(0, 5),
  )
  topLoans = computed(() => this.ranking().slice(0, 5))
  maxLoans = computed(() => Math.max(1, ...this.topLoans().map((b) => b.loans)))
  circleRows = computed(() =>
    this.circleService.circles().map((c) => {
      const list = this.store.db().enrollments.filter((e) => e.circleId === c.id)
      return {
        name: c.name,
        capacity: c.capacity,
        enrolled: c.enrolled,
        active: list.filter((e) => e.status === "Activa").length,
        pending: list.filter((e) => e.status === "Pendiente").length,
        cancelled: list.filter((e) => e.status === "Cancelada").length,
      }
    }),
  )
  kpis = computed<[string, number | string][]>(() => {
    const db = this.store.db()
    return [
      ["Libros en catálogo", db.books.length],
      ["Ejemplares", this.catalog.copies().length],
      ["Préstamos totales", db.loans.length],
      ["Préstamos atrasados", this.loanService.loans().filter((l) => l.status === "Atrasado").length],
      ["Solicitudes pendientes", db.requests.filter((r) => r.status === "Pendiente").length],
      ["Participantes en círculos", this.circleService.circles().reduce((s, c) => s + c.enrolled, 0)],
      ["Reseñas", db.reviews.length],
      [
        "Calificación media",
        db.reviews.length ? (db.reviews.reduce((s, r) => s + r.rating, 0) / db.reviews.length).toFixed(1) : "—",
      ],
    ]
  })
  exportLoans() {
    downloadCsv(
      "reporte-prestamos.csv",
      ["Usuario", "Libro", "Fecha préstamo", "Fecha límite", "Devolución", "Estado"],
      this.loanRows().map((l) => [
        this.auth.userName(l.userId),
        this.bookTitle(l.bookId),
        fmt(l.date),
        fmt(l.due),
        fmt(l.returned),
        l.status,
      ]),
    )
    this.ui.notify("Reporte exportado")
  }
  exportCircles() {
    downloadCsv(
      "reporte-circulos.csv",
      ["Círculo", "Capacidad", "Inscritos", "Confirmadas", "Pendientes", "Canceladas"],
      this.circleRows().map((c) => [c.name, c.capacity, c.enrolled, c.active, c.pending, c.cancelled]),
    )
    this.ui.notify("Reporte exportado")
  }
  exportBooks() {
    downloadCsv(
      "reporte-libros.csv",
      ["Libro", "Autor", "Préstamos", "Solicitudes", "Calificación", "Reseñas"],
      this.ranking().map((b) => [b.title, b.author, b.loans, b.requests, b.rating.toFixed(1), b.reviewCount]),
    )
    this.ui.notify("Reporte exportado")
  }
}
