import { EmptyStateComponent } from "@shared/components/empty-state/empty-state.component"
import { SelectComponent } from "@shared/components/select/select.component"
import { StatusComponent } from "@shared/components/status/status.component"
import { AdminSearchComponent } from "@features/admin/shared/components/admin-search/admin-search.component"
import { DataCardComponent } from "@features/admin/shared/components/data-card/data-card.component"
import { MiniStatComponent } from "@features/admin/shared/components/mini-stat/mini-stat.component"
import { TableToolbarComponent } from "@features/admin/shared/components/table-toolbar/table-toolbar.component"
import { UserLinkComponent } from "@features/admin/shared/components/user-link/user-link.component"
import { Component, computed, inject, signal } from "@angular/core"
import { AuthService, DatabaseStore, UiService } from "@core/services"
import type { Enrollment } from "@core/models"
import { fmt } from "@core/utils"
import { EnrollmentButtonsComponent } from "@features/admin/circles/enrollment-buttons/enrollment-buttons.component"
import { matches, downloadCsv } from "@features/admin/shared/utils/admin.utils"

@Component({
  selector: "app-enrollments-admin",
  imports: [EnrollmentButtonsComponent, EmptyStateComponent, SelectComponent, StatusComponent, AdminSearchComponent, DataCardComponent, MiniStatComponent, TableToolbarComponent, UserLinkComponent],
  templateUrl: "./enrollments-admin.component.html",
})
export class EnrollmentsAdminComponent {
  ui = inject(UiService)
  auth = inject(AuthService)
  store = inject(DatabaseStore)
  fmt = fmt
  states = ["Todos los estados", "Pendiente", "Activa", "Cancelada"]
  search = signal("")
  state = signal("Todos los estados")
  all = computed(() => this.store.db().enrollments)
  circleName(id: number) {
    return this.store.db().circles.find((c) => c.id === id)?.name || "Círculo eliminado"
  }
  rows = computed(() =>
    this.all().filter(
      (e) =>
        matches(`${this.auth.userName(e.userId)} ${this.circleName(e.circleId)}`, this.search()) &&
        (this.state() === "Todos los estados" || e.status === this.state()),
    ),
  )
  count(s: Enrollment["status"]) {
    return this.all().filter((e) => e.status === s).length
  }
  exportReport() {
    downloadCsv(
      "reporte-inscripciones.csv",
      ["Usuario", "Círculo", "Fecha", "Estado"],
      this.rows().map((e) => [this.auth.userName(e.userId), this.circleName(e.circleId), fmt(e.date), e.status]),
    )
    this.ui.notify("Reporte exportado")
  }
}
