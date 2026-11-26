import { ButtonComponent } from "@shared/components/button/button.component"
import { BookCoverComponent } from "@shared/components/book-cover/book-cover.component"
import { EmptyStateComponent } from "@shared/components/empty-state/empty-state.component"
import { IconComponent } from "@shared/components/icon/icon.component"
import { ModalComponent } from "@shared/components/modal/modal.component"
import { StarsComponent } from "@shared/components/stars/stars.component"
import { StatusComponent } from "@shared/components/status/status.component"
import { TextAreaComponent } from "@shared/components/text-area/text-area.component"
import { Component, computed, inject, input, signal } from "@angular/core"
import { AuthService, CatalogService, DatabaseStore, LoanService, UiService } from "@core/services"
import { fmt, initials } from "@core/utils"
import { NotFoundComponent } from "@shared/components/not-found/not-found.component"

@Component({
  selector: "app-book-detail",
  imports: [ButtonComponent, NotFoundComponent, BookCoverComponent, EmptyStateComponent, IconComponent, ModalComponent, StarsComponent, StatusComponent, TextAreaComponent],
  templateUrl: "./book-detail.component.html",
})
export class BookDetailComponent {
  ui = inject(UiService)
  auth = inject(AuthService)
  catalog = inject(CatalogService)
  loanService = inject(LoanService)
  store = inject(DatabaseStore)
  id = input<string>()
  initials = initials
  fmt = fmt
  tab = signal("Descripción")
  askLoan = signal(false)
  rating = signal(0)
  comment = signal("")

  book = computed(() => this.catalog.books().find((b) => b.id === Number(this.id())))
  myReview = computed(() => {
    const u = this.auth.user(),
      b = this.book()
    return u && b ? this.store.db().reviews.find((r) => r.bookId === b.id && r.userId === u.id) : undefined
  })
  bookAuthors = computed(() => this.store.db().authors.filter((a) => this.book()?.authorIds.includes(a.id)))
  copies = computed(() => this.catalog.copies().filter((c) => c.bookId === this.book()?.id))
  reviews = computed(() => this.store.db().reviews.filter((r) => r.bookId === this.book()?.id))
  favorite = computed(() => this.catalog.favorites().includes(this.book()?.id ?? -1))
  pending = computed(() => {
    const u = this.auth.user()
    return u
      ? this.store
          .db()
          .requests.find((r) => r.userId === u.id && r.bookId === this.book()?.id && r.status === "Pendiente")
      : undefined
  })
  borrowed = computed(() => {
    const u = this.auth.user()
    return u
      ? this.loanService
          .loans()
          .find((l) => l.userId === u.id && l.bookId === this.book()?.id && l.status !== "Devuelto")
      : undefined
  })
  tabs = computed(() => ["Descripción", "Autores", "Géneros", "Ejemplares", `Reseñas (${this.reviews().length})`])
  tabKey = computed(() => (this.tab().startsWith("Reseñas") ? "Reseñas" : this.tab()))

  constructor() {
    // Carga la reseña propia en el formulario al abrir el libro.
    queueMicrotask(() => {
      this.rating.set(this.myReview()?.rating || 0)
      this.comment.set(this.myReview()?.comment || "")
    })
  }

  encode = encodeURIComponent
  short(name: string) {
    return name
      .split(" ")
      .map((p) => p[0])
      .join("")
      .slice(0, 2)
  }
  toggleFavorite() {
    if (!this.auth.gate(this.ui.path())) return
    const added = this.catalog.toggleFavorite(this.book()!.id)
    this.ui.notify(added ? "Libro añadido a favoritos" : "Eliminado de favoritos")
  }
  startLoan() {
    if (this.auth.gate(this.ui.path())) this.askLoan.set(true)
  }
  confirmLoan() {
    const result = this.loanService.requestLoan(this.book()!.id)
    this.askLoan.set(false)
    if (!result.ok) return this.ui.notify(result.message || "No se pudo solicitar", "error")
    this.ui.notify("Solicitud enviada. La biblioteca te responderá pronto")
    this.ui.navigate("/solicitudes")
  }
  saveReview() {
    if (!this.auth.gate(this.ui.path())) return
    if (!this.rating()) return this.ui.notify("Elige una calificación de 1 a 5 estrellas", "error")
    this.catalog.addReview(this.book()!.id, this.rating(), this.comment())
    this.ui.notify(this.myReview() ? "Reseña actualizada" : "Gracias por tu reseña")
  }
  async removeReview() {
    const review = this.myReview()
    if (review && (await this.ui.ask({ title: "¿Eliminar tu reseña?", confirmLabel: "Eliminar", tone: "danger" }))) {
      this.catalog.deleteReview(review.id)
      this.rating.set(0)
      this.comment.set("")
      this.ui.notify("Reseña eliminada")
    }
  }
}
