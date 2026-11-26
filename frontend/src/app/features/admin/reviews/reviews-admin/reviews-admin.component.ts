import { EmptyStateComponent } from "@shared/components/empty-state/empty-state.component"
import { SelectComponent } from "@shared/components/select/select.component"
import { StarsComponent } from "@shared/components/stars/stars.component"
import { ActionsComponent } from "@features/admin/shared/components/actions/actions.component"
import { AdminSearchComponent } from "@features/admin/shared/components/admin-search/admin-search.component"
import { DataCardComponent } from "@features/admin/shared/components/data-card/data-card.component"
import { TableToolbarComponent } from "@features/admin/shared/components/table-toolbar/table-toolbar.component"
import { UserLinkComponent } from "@features/admin/shared/components/user-link/user-link.component"
import { Component, computed, inject, signal } from "@angular/core"
import { AuthService, CatalogService, DatabaseStore, UiService } from "@core/services"
import { fmt } from "@core/utils"
import { matches } from "@features/admin/shared/utils/admin.utils"

@Component({
  selector: "app-reviews-admin",
  imports: [EmptyStateComponent, SelectComponent, StarsComponent, ActionsComponent, AdminSearchComponent, DataCardComponent, TableToolbarComponent, UserLinkComponent],
  templateUrl: "./reviews-admin.component.html",
})
export class ReviewsAdminComponent {
  ui = inject(UiService)
  auth = inject(AuthService)
  catalog = inject(CatalogService)
  store = inject(DatabaseStore)
  fmt = fmt
  search = signal("")
  bookFilter = signal("")
  bookOptions = computed(() => [
    { value: "", label: "Todos los libros" },
    ...this.store.db().books.map((b) => ({ value: String(b.id), label: b.title })),
  ])
  title(id: number) {
    return this.store.db().books.find((b) => b.id === id)?.title || "Libro eliminado"
  }
  rows = computed(() =>
    [...this.store.db().reviews]
      .sort((a, b) => b.id - a.id)
      .filter(
        (r) =>
          (!this.bookFilter() || String(r.bookId) === this.bookFilter()) &&
          matches(`${this.title(r.bookId)} ${this.auth.userName(r.userId)} ${r.comment}`, this.search()),
      ),
  )
  async remove(id: number) {
    const ok = await this.ui.ask({
      title: "Eliminar reseña",
      message: "La reseña dejará de mostrarse en el sitio y afectará la calificación del libro.",
      confirmLabel: "Eliminar reseña",
      tone: "danger",
    })
    if (!ok) return
    this.catalog.deleteReview(id)
    this.ui.notify("Reseña eliminada")
  }
}
