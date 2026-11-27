import { EmptyStateComponent } from "@shared/components/empty-state/empty-state.component"
import { IconComponent } from "@shared/components/icon/icon.component"
import { StatusComponent } from "@shared/components/status/status.component"
import { ActionsComponent } from "@features/admin/shared/components/actions/actions.component"
import { TableToolbarComponent } from "@features/admin/shared/components/table-toolbar/table-toolbar.component"
import { Component, inject } from "@angular/core"
import { CircleService, DatabaseStore, UiService } from "@core/services"
import { fmt } from "@core/utils"

@Component({
  selector: "app-circles-admin",
  imports: [EmptyStateComponent, IconComponent, StatusComponent, ActionsComponent, TableToolbarComponent],
  templateUrl: "./circles-admin.component.html",
})
export class CirclesAdminComponent {
  ui = inject(UiService)
  circleService = inject(CircleService)
  store = inject(DatabaseStore)
  fmt = fmt
  bookOf(id: number | null) {
    return this.store.db().books.find((b) => b.id === id)
  }
  pct(enrolled: number, capacity: number) {
    return Math.min(100, Math.round((enrolled / Math.max(capacity, 1)) * 100))
  }
  async toggle(id: number, active: boolean, name: string) {
    const ok = await this.ui.ask({
      title: active ? "Desactivar círculo" : "Activar círculo",
      message: active
        ? `"${name}" dejará de aceptar inscripciones públicas.`
        : `"${name}" volverá a estar visible para los lectores.`,
      confirmLabel: active ? "Desactivar" : "Activar",
      tone: active ? "danger" : "default",
    })
    if (!ok) return
    this.circleService.toggleCircle(id)
    this.ui.notify(active ? "Círculo desactivado" : "Círculo activado")
  }
}
