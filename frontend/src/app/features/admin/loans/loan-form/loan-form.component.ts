import { ButtonComponent } from "@shared/components/button/button.component"
import { BookCoverComponent } from "@shared/components/book-cover/book-cover.component"
import { PageHeaderComponent } from "@shared/components/page-header/page-header.component"
import { SelectComponent } from "@shared/components/select/select.component"
import { CrumbsComponent } from "@features/admin/shared/components/crumbs/crumbs.component"
import { Component, OnInit, computed, inject, signal } from "@angular/core"
import { CatalogService, DatabaseStore, LoanService, UiService } from "@core/services"
import { iso, fmt } from "@core/utils"

@Component({
  selector: "app-loan-form",
  imports: [ButtonComponent, BookCoverComponent, PageHeaderComponent, SelectComponent, CrumbsComponent],
  templateUrl: "./loan-form.component.html",
})
export class LoanFormComponent implements OnInit {
  ui = inject(UiService)
  catalog = inject(CatalogService)
  loanService = inject(LoanService)
  store = inject(DatabaseStore)
  fmt = fmt
  today = iso()
  terms = [
    { value: "7", label: "7 días" },
    { value: "14", label: "14 días" },
    { value: "21", label: "21 días" },
  ]
  userId = signal("")
  bookId = signal("")
  copyChoice = signal("")
  days = signal("14")
  eligible = computed(() => this.store.db().accounts.filter((a) => a.active && a.role === "Usuario"))
  activeBooks = computed(() => this.catalog.books().filter((b) => b.active))
  userOptions = computed(() =>
    this.eligible().length
      ? this.eligible().map((a) => ({ value: String(a.id), label: `${a.name} ${a.last} · ${a.member}` }))
      : [{ value: "", label: "No hay usuarios activos" }],
  )
  bookOptions = computed(() =>
    this.activeBooks().map((b) => ({
      value: String(b.id),
      label: `${b.title} (${b.copiesFree} libre${b.copiesFree === 1 ? "" : "s"})`,
    })),
  )
  free = computed(() => (this.bookId() ? this.catalog.freeCopies(Number(this.bookId())) : []))
  copy = computed(() => {
    const free = this.free()
    return free.some((c) => String(c.number) === this.copyChoice())
      ? this.copyChoice()
      : free[0]
        ? String(free[0].number)
        : ""
  })
  copyOptions = computed(() =>
    this.free().map((c) => ({ value: String(c.number), label: `${c.code} · ${c.location}` })),
  )
  selectedBook = computed(() => this.catalog.books().find((b) => String(b.id) === this.bookId()))
  selectedUser = computed(() => this.eligible().find((a) => String(a.id) === this.userId()))
  selectedCopy = computed(() => this.free().find((c) => String(c.number) === this.copy()))
  due = computed(() => iso(Number(this.days())))

  ngOnInit() {
    const queryUser = Number(this.ui.query().get("usuario"))
    const el = this.eligible()
    this.userId.set(String(el.find((a) => a.id === queryUser)?.id ?? el[0]?.id ?? ""))
    const books = this.activeBooks()
    this.bookId.set(String((books.find((b) => b.copiesFree > 0) || books[0])?.id ?? ""))
  }
  submit(event: Event) {
    event.preventDefault()
    if (!this.userId() || !this.bookId() || !this.copy())
      return this.ui.notify("Selecciona usuario, libro y un ejemplar disponible", "error")
    const result = this.loanService.registerLoan(
      Number(this.userId()),
      Number(this.bookId()),
      Number(this.copy()),
      Number(this.days()),
    )
    if (!result.ok) return this.ui.notify(result.message || "No se pudo registrar", "error")
    this.ui.notify("Préstamo registrado correctamente")
    this.ui.navigate("/admin/prestamos")
  }
}
