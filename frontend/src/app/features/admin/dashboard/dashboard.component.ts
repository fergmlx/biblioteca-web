import { ButtonComponent } from "@shared/components/button/button.component"
import { EmptyStateComponent } from "@shared/components/empty-state/empty-state.component"
import { IconComponent } from "@shared/components/icon/icon.component"
import { PageHeaderComponent } from "@shared/components/page-header/page-header.component"
import { LoanTableComponent } from "@features/admin/shared/components/loan-table/loan-table.component"
import { Component, computed, inject } from "@angular/core"
import { AuthService, CatalogService, DatabaseStore, LoanService, UiService } from "@core/services"
import { iso, fmt } from "@core/utils"
import type { IconName } from "@shared/components/icon/icons"

@Component({
  selector: "app-dashboard",
  imports: [ButtonComponent, EmptyStateComponent, IconComponent, PageHeaderComponent, LoanTableComponent],
  templateUrl: "./dashboard.component.html",
})
export class DashboardComponent {
  ui = inject(UiService)
  auth = inject(AuthService)
  catalog = inject(CatalogService)
  loanService = inject(LoanService)
  store = inject(DatabaseStore)
  fmt = fmt
  Math = Math
  greeting = () => {
    const hour = new Date().getHours()
    return hour < 12 ? "Buenos días" : hour < 19 ? "Buenas tardes" : "Buenas noches"
  }
  private s = computed(() => {
    const db = this.store.db()
    const loans = this.loanService.loans()
    const copies = this.catalog.copies()
    return {
      db,
      active: loans.filter((l) => l.status !== "Devuelto"),
      late: loans.filter((l) => l.status === "Atrasado"),
      free: copies.filter((c) => c.status === "Disponible").length,
      damaged: copies.filter((c) => c.status === "Mantenimiento").length,
      pReq: db.requests.filter((r) => r.status === "Pendiente").length,
      pEnr: db.enrollments.filter((e) => e.status === "Pendiente").length,
    }
  })
  stats = computed<[IconName, string, number, string][]>(() => {
    const s = this.s(),
      db = s.db
    return [
      ["users", "Usuarios", db.accounts.length, `${db.accounts.filter((a) => a.active).length} activos`],
      ["book", "Libros", db.books.length, `${db.books.filter((b) => b.active).length} activos`],
      ["copy", "Ejemplares", this.catalog.copies().length, `${s.free} disponibles`],
      ["clock", "Solicitudes pendientes", s.pReq, `${db.requests.length} en total`],
      ["loan", "Préstamos activos", s.active.length, `${db.loans.length} en total`],
      ["clock", "Préstamos atrasados", s.late.length, s.late.length ? "Requieren seguimiento" : "Todo al día"],
    ]
  })
  week = computed(() =>
    Array.from({ length: 7 }, (_, i) => {
      const day = iso(i - 6)
      const label = ["Dom", "Lun", "Mar", "Mié", "Jue", "Vie", "Sáb"][new Date(`${day}T12:00:00`).getDay()]
      return { day, label, count: this.store.db().loans.filter((l) => l.date === day).length }
    }),
  )
  max = computed(() => Math.max(1, ...this.week().map((d) => d.count)))
  recent = computed(() => [...this.loanService.loans()].sort((a, b) => b.id - a.id).slice(0, 5))
  pending = computed<{ path: string; tone: string; icon: IconName; title: string; sub: string }[]>(() => {
    const s = this.s()
    const pl = (n: number, one: string, many: string) => (n === 1 ? one : many)
    return [
      {
        path: "/admin/solicitudes",
        tone: "warning",
        icon: "clock",
        title: `${s.pReq} solicitud${pl(s.pReq, "", "es")} pendiente${pl(s.pReq, "", "s")}`,
        sub: "Préstamos esperando aprobación",
      },
      {
        path: "/admin/prestamos",
        tone: "red",
        icon: "loan",
        title: `${s.late.length} préstamo${pl(s.late.length, "", "s")} atrasado${pl(s.late.length, "", "s")}`,
        sub: "Requieren seguimiento hoy",
      },
      {
        path: "/admin/inscripciones",
        tone: "purple",
        icon: "calendar",
        title: `${s.pEnr} inscripci${pl(s.pEnr, "ón", "ones")} pendiente${pl(s.pEnr, "", "s")}`,
        sub: "Esperando confirmación",
      },
      {
        path: "/admin/ejemplares",
        tone: "red",
        icon: "copy",
        title: `${s.damaged} ejemplar${pl(s.damaged, "", "es")} en mantenimiento`,
        sub: "Revisa su condición",
      },
    ]
  })
}
