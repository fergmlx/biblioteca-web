import { ButtonComponent } from "@shared/components/button/button.component"
import { EmptyStateComponent } from "@shared/components/empty-state/empty-state.component"
import { FieldComponent } from "@shared/components/field/field.component"
import { ModalComponent } from "@shared/components/modal/modal.component"
import { ActionsComponent } from "@features/admin/shared/components/actions/actions.component"
import { DataCardComponent } from "@features/admin/shared/components/data-card/data-card.component"
import { TableToolbarComponent } from "@features/admin/shared/components/table-toolbar/table-toolbar.component"
import { Component, inject, signal } from "@angular/core"
import { CatalogService, DatabaseStore, UiService } from "@core/services"
import { norm } from "@features/admin/shared/utils/admin.utils"

@Component({
  selector: "app-genres-admin",
  imports: [ButtonComponent, EmptyStateComponent, FieldComponent, ModalComponent, ActionsComponent, DataCardComponent, TableToolbarComponent],
  templateUrl: "./genres-admin.component.html",
})
export class GenresAdminComponent {
  ui = inject(UiService)
  catalog = inject(CatalogService)
  store = inject(DatabaseStore)
  modal = signal<{ id?: number; name: string } | null>(null)
  name = signal("")
  usage(name: string) {
    return this.store.db().books.filter((b) => b.genres.includes(name)).length
  }
  edit(id: number, name: string) {
    this.name.set(name)
    this.modal.set({ id, name })
  }
  save() {
    const m = this.modal()
    if (!m) return
    const name = this.name().trim()
    if (!name) return this.ui.notify("El nombre es obligatorio", "error")
    if (this.store.db().genres.some((g) => norm(g.name) === norm(name) && g.id !== m.id))
      return this.ui.notify("Ya existe un género con ese nombre", "error")
    this.catalog.saveGenre(name, m.id)
    this.ui.notify(m.id ? "Género renombrado" : "Género creado")
    this.modal.set(null)
  }
  async remove(id: number, name: string) {
    const used = this.usage(name)
    if (used > 0) return this.ui.notify(`No se puede eliminar: lo usan ${used} libro(s)`, "error")
    const ok = await this.ui.ask({
      title: "Eliminar género",
      message: `Se eliminará "${name}".`,
      confirmLabel: "Eliminar",
      tone: "danger",
    })
    if (!ok) return
    this.catalog.deleteGenre(id)
    this.ui.notify("Género eliminado")
  }
}
