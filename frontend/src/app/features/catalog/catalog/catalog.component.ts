import { ButtonComponent } from "@shared/components/button/button.component"
import { languages } from "@core/constants"
import { EmptyStateComponent } from "@shared/components/empty-state/empty-state.component"
import { IconComponent } from "@shared/components/icon/icon.component"
import { PageHeaderComponent } from "@shared/components/page-header/page-header.component"
import { SelectComponent } from "@shared/components/select/select.component"
import { Component, computed, inject, signal } from "@angular/core"
import { CatalogService, DatabaseStore, UiService } from "@core/services"
import { BookCardComponent } from "@shared/components/book-card/book-card.component"

const PAGE_SIZE = 4

@Component({
  selector: "app-catalog",
  imports: [ButtonComponent, BookCardComponent, EmptyStateComponent, IconComponent, PageHeaderComponent, SelectComponent],
  templateUrl: "./catalog.component.html",
})
export class CatalogComponent {
  ui = inject(UiService)
  catalog = inject(CatalogService)
  store = inject(DatabaseStore)
  query = signal(this.ui.query().get("q") || "")
  genre = signal(this.ui.query().get("genero") || "Todos")
  author = signal(this.ui.query().get("autor") || "Todos")
  language = signal("Todos")
  era = signal("Todos")
  availability = signal("Todos")
  page = signal(1)
  langs = ["Todos", ...languages]
  eras = ["Todos", "Antes de 1950", "1950–2000", "Después de 2000"]
  avail = ["Todos", "Disponibles", "En préstamo"]

  genres = computed(() => ["Todos", ...this.store.db().genres.map((g) => g.name)])
  authors = computed(() => [
    { value: "Todos", label: "Todos" },
    ...this.store.db().authors.map((a) => ({ value: String(a.id), label: this.catalog.authorName(a) })),
  ])
  filtered = computed(() => {
    const q = this.query().toLowerCase(),
      genre = this.genre(),
      author = this.author()
    const language = this.language(),
      era = this.era(),
      availability = this.availability()
    return this.catalog.books().filter((b) => {
      if (!b.active) return false
      const text = `${b.title} ${b.author} ${b.genre}`.toLowerCase()
      const byEra =
        era === "Todos" ||
        (era === "Antes de 1950" && b.year < 1950) ||
        (era === "1950–2000" && b.year >= 1950 && b.year <= 2000) ||
        (era === "Después de 2000" && b.year > 2000)
      return (
        text.includes(q) &&
        (genre === "Todos" || b.genres.includes(genre)) &&
        (author === "Todos" || b.authorIds.includes(Number(author))) &&
        (language === "Todos" || b.language === language) &&
        byEra &&
        (availability === "Todos" || (availability === "Disponibles" ? b.available : !b.available))
      )
    })
  })
  pages = computed(() => Math.max(1, Math.ceil(this.filtered().length / PAGE_SIZE)))
  pageNumbers = computed(() => Array.from({ length: this.pages() }, (_, i) => i + 1))
  current = computed(() => Math.min(this.page(), this.pages()))
  shown = computed(() => this.filtered().slice((this.current() - 1) * PAGE_SIZE, this.current() * PAGE_SIZE))

  pick(target: { set(v: string): void }, value: string) {
    target.set(value)
    this.page.set(1)
  }
  pickQuery(v: string) {
    this.pick(this.query, v)
  }
  reset() {
    this.query.set("")
    this.genre.set("Todos")
    this.author.set("Todos")
    this.language.set("Todos")
    this.era.set("Todos")
    this.availability.set("Todos")
    this.page.set(1)
  }
}
