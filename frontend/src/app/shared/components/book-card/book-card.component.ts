import { ButtonComponent } from "@shared/components/button/button.component"
import { BookCoverComponent } from "@shared/components/book-cover/book-cover.component"
import { IconComponent } from "@shared/components/icon/icon.component"
import { StatusComponent } from "@shared/components/status/status.component"
import { Component, inject, input } from "@angular/core"
import { AuthService, CatalogService, UiService } from "@core/services"
import type { BookView } from "@core/models"

@Component({
  selector: "app-book-card",
  imports: [ButtonComponent, BookCoverComponent, IconComponent, StatusComponent],
  host: { style: "display: contents" },
  templateUrl: "./book-card.component.html",
})
export class BookCardComponent {
  ui = inject(UiService)
  auth = inject(AuthService)
  catalog = inject(CatalogService)
  book = input.required<BookView>()
  favorite = () => this.catalog.favorites().includes(this.book().id)
  toggle() {
    if (!this.auth.gate(`/libros/${this.book().id}`)) return
    const added = this.catalog.toggleFavorite(this.book().id)
    this.ui.notify(added ? "Libro añadido a favoritos" : "Eliminado de favoritos")
  }
}
