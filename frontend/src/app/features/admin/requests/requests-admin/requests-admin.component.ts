import { ButtonComponent } from "@shared/components/button/button.component"
import { EmptyStateComponent } from "@shared/components/empty-state/empty-state.component"
import { IconComponent } from "@shared/components/icon/icon.component"
import { ModalComponent } from "@shared/components/modal/modal.component"
import { SelectComponent } from "@shared/components/select/select.component"
import { StatusComponent } from "@shared/components/status/status.component"
import { TextAreaComponent } from "@shared/components/text-area/text-area.component"
import { AdminTabsComponent } from "@features/admin/shared/components/admin-tabs/admin-tabs.component"
import { DataCardComponent } from "@features/admin/shared/components/data-card/data-card.component"
import { TableToolbarComponent } from "@features/admin/shared/components/table-toolbar/table-toolbar.component"
import { UserLinkComponent } from "@features/admin/shared/components/user-link/user-link.component"
import { Component, computed, inject, signal } from "@angular/core"
import { AuthService, CatalogService, DatabaseStore, LoanService, UiService } from "@core/services"
import type { LoanRequest } from "@core/models"
import { fmt } from "@core/utils"

@Component({
  selector: "app-requests-admin",
  imports: [ButtonComponent, EmptyStateComponent, IconComponent, ModalComponent, SelectComponent, StatusComponent, TextAreaComponent, AdminTabsComponent, DataCardComponent, TableToolbarComponent, UserLinkComponent],
  templateUrl: "./requests-admin.component.html",
})
export class RequestsAdminComponent {
  ui = inject(UiService)
  auth = inject(AuthService)
  catalog = inject(CatalogService)
  loanService = inject(LoanService)
  store = inject(DatabaseStore)
  fmt = fmt
  tab = signal("Pendiente")
  modal = signal<{ request: LoanRequest; approve: boolean } | null>(null)
  created = signal("")
  copy = signal("")
  notes = signal("")
  all = computed(() => [...this.store.db().requests].sort((a, b) => b.id - a.id))
  rows = computed(() => (this.tab() === "Todas" ? this.all() : this.all().filter((r) => r.status === this.tab())))
  tabs = computed(() => {
    const c = (s: string) => this.all().filter((r) => r.status === s).length
    return [
      { id: "Pendiente", label: "Pendientes", count: c("Pendiente") },
      { id: "Aprobada", label: "Aprobadas", count: c("Aprobada") },
      { id: "Rechazada", label: "Rechazadas", count: c("Rechazada") },
      { id: "Todas", label: "Todas", count: this.all().length },
    ]
  })
  freeCopies = computed(() => (this.modal() ? this.catalog.freeCopies(this.modal()!.request.bookId) : []))
  copyOptions = computed(() =>
    this.freeCopies().map((c) => ({ value: String(c.number), label: `${c.code} · ${c.location}` })),
  )
  bookTitle(id: number) {
    return this.store.db().books.find((b) => b.id === id)?.title || "Libro eliminado"
  }
  free(bookId: number) {
    return this.catalog.freeCopies(bookId).length
  }
  openModal(request: LoanRequest, approve: boolean) {
    this.notes.set("")
    const free = this.catalog.freeCopies(request.bookId)
    this.copy.set(free[0] ? String(free[0].number) : "")
    this.modal.set({ request, approve })
  }
  submit() {
    const { request, approve } = this.modal()!
    if (approve) {
      if (!this.copy()) return this.ui.notify("Selecciona un ejemplar", "error")
      const result = this.loanService.resolveRequest(request.id, true, this.notes(), Number(this.copy()))
      if (!result.ok) return this.ui.notify(result.message || "No se pudo aprobar", "error")
      this.ui.notify("Préstamo creado")
      this.created.set(
        `Préstamo creado para ${this.auth.userName(request.userId)}: "${this.bookTitle(request.bookId)}". Ya aparece en sus préstamos.`,
      )
    } else {
      if (!this.notes().trim()) return this.ui.notify("Indica el motivo del rechazo", "error")
      this.loanService.resolveRequest(request.id, false, this.notes().trim())
      this.ui.notify("Solicitud rechazada")
      this.created.set("")
    }
    this.modal.set(null)
  }
}
