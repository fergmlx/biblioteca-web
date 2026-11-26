import { ButtonComponent } from "@shared/components/button/button.component"
import { BookCoverComponent } from "@shared/components/book-cover/book-cover.component"
import { FieldComponent } from "@shared/components/field/field.component"
import { IconComponent } from "@shared/components/icon/icon.component"
import { PageHeaderComponent } from "@shared/components/page-header/page-header.component"
import { StarsComponent } from "@shared/components/stars/stars.component"
import { StatusComponent } from "@shared/components/status/status.component"
import { Component, computed, inject, signal } from "@angular/core"
import { AuthService, CatalogService, DatabaseStore, LoanService, UiService } from "@core/services"
import { fmt, initials } from "@core/utils"
import type { IconName } from "@shared/components/icon/icons"

@Component({
  selector: "app-profile",
  imports: [ButtonComponent, BookCoverComponent, FieldComponent, IconComponent, PageHeaderComponent, StarsComponent, StatusComponent],
  templateUrl: "./profile.component.html",
})
export class ProfileComponent {
  ui = inject(UiService)
  auth = inject(AuthService)
  catalog = inject(CatalogService)
  loanService = inject(LoanService)
  store = inject(DatabaseStore)
  initials = initials
  fmt = fmt
  editing = signal(false)
  name = signal(this.auth.user()?.name ?? "")
  last = signal(this.auth.user()?.last ?? "")
  phone = signal(this.auth.user()?.phone ?? "")
  links: [IconName, string, string][] = [
    ["loan", "Mis préstamos", "/prestamos"],
    ["clock", "Mis solicitudes", "/solicitudes"],
    ["heart", "Mis favoritos", "/favoritos"],
    ["users", "Mis círculos", "/mis-circulos"],
  ]
  loansActive = computed(
    () => this.loanService.loans().filter((l) => l.userId === this.auth.user()?.id && l.status !== "Devuelto").length,
  )
  circlesActive = computed(
    () =>
      this.store.db().enrollments.filter((e) => e.userId === this.auth.user()?.id && e.status !== "Cancelada").length,
  )
  myReviews = computed(() =>
    this.store
      .db()
      .reviews.filter((r) => r.userId === this.auth.user()?.id)
      .map((review) => ({ review, book: this.catalog.books().find((b) => b.id === review.bookId)! }))
      .filter((x) => x.book),
  )
  toggleEdit() {
    this.editing.update((v) => !v)
  }
  async logout() {
    if (
      await this.ui.ask({
        title: "Cerrar sesión",
        message: "¿Seguro que deseas salir de tu cuenta?",
        confirmLabel: "Cerrar sesión",
      })
    ) {
      this.auth.logout()
      this.ui.notify("Sesión cerrada correctamente")
      this.ui.navigate("/")
    }
  }
  save() {
    if (!this.name().trim() || !this.last().trim())
      return this.ui.notify("Nombre y apellidos son obligatorios", "error")
    this.auth.updateProfile({ name: this.name(), last: this.last(), phone: this.phone() })
    this.editing.set(false)
    this.ui.notify("Tus datos fueron actualizados")
  }
}
