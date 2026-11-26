import { BookCoverComponent } from "@shared/components/book-cover/book-cover.component"
import { EmptyStateComponent } from "@shared/components/empty-state/empty-state.component"
import { IconComponent } from "@shared/components/icon/icon.component"
import { SelectComponent } from "@shared/components/select/select.component"
import { StatusComponent } from "@shared/components/status/status.component"
import { ActionsComponent } from "@features/admin/shared/components/actions/actions.component"
import { AdminSearchComponent } from "@features/admin/shared/components/admin-search/admin-search.component"
import { DataCardComponent } from "@features/admin/shared/components/data-card/data-card.component"
import { TableToolbarComponent } from "@features/admin/shared/components/table-toolbar/table-toolbar.component"
import { Component, computed, inject, signal } from "@angular/core"
import { CatalogService, UiService } from "@core/services"
import { matches } from "@features/admin/shared/utils/admin.utils"

@Component({
  selector: "app-books-admin",
  imports: [BookCoverComponent, EmptyStateComponent, IconComponent, SelectComponent, StatusComponent, ActionsComponent, AdminSearchComponent, DataCardComponent, TableToolbarComponent],
  templateUrl: "./books-admin.component.html",
})
export class BooksAdminComponent {
  ui = inject(UiService)
  catalog = inject(CatalogService)
  states = ["Todos", "Activos", "Inactivos"]
  search = signal("")
  state = signal("Todos")
  data = computed(() =>
    this.catalog
      .books()
      .filter(
        (b) =>
          matches(`${b.title} ${b.author} ${b.isbn}`, this.search()) &&
          (this.state() === "Todos" || (this.state() === "Activos" ? b.active : !b.active)),
      ),
  )
  async toggle(id: number, active: boolean, title: string) {
    const ok = await this.ui.ask({
      title: active ? "Desactivar libro" : "Activar libro",
      message: active
        ? `"${title}" dejará de aparecer en el catálogo público.`
        : `"${title}" volverá a mostrarse en el catálogo público.`,
      confirmLabel: active ? "Desactivar" : "Activar",
      tone: active ? "danger" : "default",
    })
    if (!ok) return
    this.catalog.toggleBook(id)
    this.ui.notify(active ? "Libro desactivado" : "Libro activado")
  }
}
