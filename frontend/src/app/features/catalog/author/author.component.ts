import { EmptyStateComponent } from "@shared/components/empty-state/empty-state.component"
import { IconComponent } from "@shared/components/icon/icon.component"
import { Component, computed, inject, input } from "@angular/core"
import { CatalogService, DatabaseStore } from "@core/services"
import { initials } from "@core/utils"
import { NotFoundComponent } from "@shared/components/not-found/not-found.component"
import { BookCardComponent } from "@shared/components/book-card/book-card.component"

@Component({
  selector: "app-author",
  imports: [BookCardComponent, NotFoundComponent, EmptyStateComponent, IconComponent],
  templateUrl: "./author.component.html",
})
export class AuthorComponent {
  catalog = inject(CatalogService)
  store = inject(DatabaseStore)
  id = input<string>()
  initials = initials
  author = computed(() => this.store.db().authors.find((a) => a.id === Number(this.id())))
  works = computed(() => this.catalog.books().filter((b) => b.active && b.authorIds.includes(this.author()?.id ?? -1)))
  year(d: string) {
    return d ? d.slice(0, 4) : ""
  }
  back() {
    window.history.back()
  }
}
