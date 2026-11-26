import { ButtonComponent } from "@shared/components/button/button.component"
import { BookCoverComponent } from "@shared/components/book-cover/book-cover.component"
import { EmptyStateComponent } from "@shared/components/empty-state/empty-state.component"
import { PageHeaderComponent } from "@shared/components/page-header/page-header.component"
import { StatusComponent } from "@shared/components/status/status.component"
import { Component, computed, inject } from "@angular/core"
import { CatalogService, UiService } from "@core/services"

@Component({
  selector: "app-favorites",
  imports: [ButtonComponent, BookCoverComponent, EmptyStateComponent, PageHeaderComponent, StatusComponent],
  templateUrl: "./favorites.component.html",
})
export class FavoritesComponent {
  ui = inject(UiService)
  catalog = inject(CatalogService)
  items = computed(() => this.catalog.books().filter((b) => this.catalog.favorites().includes(b.id)))
  async remove(id: number, title: string) {
    if (
      await this.ui.ask({
        title: "Quitar de favoritos",
        message: `¿Deseas eliminar "${title}" de tu lista?`,
        confirmLabel: "Eliminar",
        tone: "danger",
      })
    ) {
      this.catalog.toggleFavorite(id)
      this.ui.notify("Libro eliminado de favoritos")
    }
  }
}
