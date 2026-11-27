import { ButtonComponent } from "@shared/components/button/button.component"
import { BookCoverComponent } from "@shared/components/book-cover/book-cover.component"
import { FieldComponent } from "@shared/components/field/field.component"
import { IconComponent } from "@shared/components/icon/icon.component"
import { PageHeaderComponent } from "@shared/components/page-header/page-header.component"
import { SelectComponent } from "@shared/components/select/select.component"
import { TextAreaComponent } from "@shared/components/text-area/text-area.component"
import { AdminNotFoundComponent } from "@features/admin/shared/components/admin-not-found/admin-not-found.component"
import { CrumbsComponent } from "@features/admin/shared/components/crumbs/crumbs.component"
import { Component, OnInit, computed, inject, input, signal } from "@angular/core"
import { CatalogService, DatabaseStore, UiService } from "@core/services"
import { languages } from "@core/constants"

const coverColors = ["#3F6450", "#B08A3E", "#6B4A32", "#2F4A3A", "#5C5648", "#4F6B3A", "#1F3329"]

/* ------------------------------------------------------------- Ejemplares */

/* ---------------------------------------------------------------- Autores */

@Component({
  selector: "app-book-form",
  imports: [ButtonComponent, BookCoverComponent, FieldComponent, IconComponent, PageHeaderComponent, SelectComponent, TextAreaComponent, AdminNotFoundComponent, CrumbsComponent],
  templateUrl: "./book-form.component.html",
})
export class BookFormComponent implements OnInit {
  ui = inject(UiService)
  catalog = inject(CatalogService)
  store = inject(DatabaseStore)
  id = input<string>()
  languages = languages
  colors = coverColors
  book = computed(() => this.store.db().books.find((b) => b.id === Number(this.id())) ?? null)
  missing = computed(() => !!this.id() && !this.book())
  f = signal({
    isbn: "",
    title: "",
    publisher: "",
    language: "Español",
    year: "",
    description: "",
    color: coverColors[0],
  })
  authorIds = signal<string[]>([""])
  genres = signal<string[]>([""])
  coverUrl = signal("")
  authorOptions = computed(() => [
    { value: "", label: "Seleccionar autor" },
    ...this.store
      .db()
      .authors.map((a) => ({
        value: String(a.id),
        label: this.catalog.authorName(a) + (a.active ? "" : " (inactivo)"),
      })),
  ])
  genreOptions = computed(() => [
    { value: "", label: "Seleccionar género" },
    ...this.store.db().genres.map((g) => ({ value: g.name, label: g.name })),
  ])

  ngOnInit() {
    const b = this.book()
    if (!b) return
    this.f.set({
      isbn: b.isbn,
      title: b.title,
      publisher: b.publisher,
      language: b.language,
      year: String(b.year),
      description: b.description,
      color: b.color,
    })
    this.authorIds.set(b.authorIds.length ? b.authorIds.map(String) : [""])
    this.genres.set(b.genres.length ? b.genres : [""])
  }
  set(key: string, value: string) {
    this.f.update((c) => ({ ...c, [key]: value }))
  }
  replace(list: { set(v: string[]): void; (): string[] }, index: number, value: string) {
    list.set(list().map((x, i) => (i === index ? value : x)))
  }
  remove(list: { set(v: string[]): void; (): string[] }, index: number) {
    list.set(list().filter((_, i) => i !== index))
  }
  pickFile(event: Event) {
    const file = (event.target as HTMLInputElement).files?.[0]
    if (file) this.coverUrl.set(URL.createObjectURL(file))
  }
  submit(event: Event) {
    event.preventDefault()
    const f = this.f(),
      book = this.book()
    const chosenAuthors = [...new Set(this.authorIds().filter(Boolean).map(Number))]
    const chosenGenres = [...new Set(this.genres().filter(Boolean))]
    if (!f.isbn.trim() || !f.title.trim() || !f.publisher.trim() || !f.year || !f.description.trim())
      return this.ui.notify("Completa los campos obligatorios", "error")
    if (!chosenAuthors.length) return this.ui.notify("Selecciona al menos un autor", "error")
    this.catalog.saveBook({
      id: book?.id,
      isbn: f.isbn.trim(),
      title: f.title.trim(),
      publisher: f.publisher.trim(),
      language: f.language,
      year: Number(f.year),
      description: f.description.trim(),
      color: f.color,
      authorIds: chosenAuthors,
      genres: chosenGenres,
      active: book?.active ?? true,
    })
    this.ui.notify(book ? "Libro actualizado correctamente" : "Libro creado correctamente")
    this.ui.navigate("/admin/libros")
  }
}
