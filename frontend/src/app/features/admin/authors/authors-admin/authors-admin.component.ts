import { EmptyStateComponent } from "@shared/components/empty-state/empty-state.component"
import { StatusComponent } from "@shared/components/status/status.component"
import { ActionsComponent } from "@features/admin/shared/components/actions/actions.component"
import { AdminSearchComponent } from "@features/admin/shared/components/admin-search/admin-search.component"
import { DataCardComponent } from "@features/admin/shared/components/data-card/data-card.component"
import { TableToolbarComponent } from "@features/admin/shared/components/table-toolbar/table-toolbar.component"
import { Component, computed, inject, signal } from "@angular/core"
import { CatalogService, DatabaseStore, UiService } from "@core/services"
import { fmt } from "@core/utils"
import { matches } from "@features/admin/shared/utils/admin.utils"

@Component({
  selector: "app-authors-admin",
  imports: [EmptyStateComponent, StatusComponent, ActionsComponent, AdminSearchComponent, DataCardComponent, TableToolbarComponent],
  templateUrl: "./authors-admin.component.html",
})
export class AuthorsAdminComponent {
  ui = inject(UiService)
  catalog = inject(CatalogService)
  store = inject(DatabaseStore)
  fmt = fmt
  search = signal("")
  data = computed(() =>
    this.store.db().authors.filter((a) => matches(`${this.catalog.authorName(a)} ${a.country}`, this.search())),
  )
  countBooks(id: number) {
    return this.store.db().books.filter((b) => b.authorIds.includes(id)).length
  }
  async toggle(id: number, active: boolean, name: string) {
    const ok = await this.ui.ask({
      title: active ? "Desactivar autor" : "Activar autor",
      message: `${active ? "Se desactivará" : "Se activará"} a ${name}.`,
      confirmLabel: active ? "Desactivar" : "Activar",
      tone: active ? "danger" : "default",
    })
    if (!ok) return
    this.catalog.toggleAuthor(id)
    this.ui.notify(active ? "Autor desactivado" : "Autor activado")
  }
}
