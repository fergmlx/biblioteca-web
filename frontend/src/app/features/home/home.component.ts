import { ButtonComponent } from "@shared/components/button/button.component"
import { IconComponent } from "@shared/components/icon/icon.component"
import { Component, computed, inject, signal } from "@angular/core"
import { AuthService, CatalogService, CircleService, DatabaseStore, LoanService, UiService } from "@core/services"
import type { IconName } from "@shared/components/icon/icons"
import { BookCardComponent } from "@shared/components/book-card/book-card.component"

@Component({
  selector: "app-home",
  imports: [ButtonComponent, BookCardComponent, IconComponent],
  templateUrl: "./home.component.html",
})
export class HomeComponent {
  ui = inject(UiService)
  auth = inject(AuthService)
  catalog = inject(CatalogService)
  loanService = inject(LoanService)
  circleService = inject(CircleService)
  store = inject(DatabaseStore)
  query = signal("")
  activeBooks = computed(() => this.catalog.books().filter((b) => b.active))
  activeCircles = computed(() => this.circleService.circles().filter((c) => c.active))
  quick: [IconName, string, string, string][] = [
    ["book", "Catálogo de libros", "Encuentra tu próxima lectura entre todos nuestros títulos.", "/catalogo"],
    ["users", "Círculos de lectura", "Comparte ideas y disfruta nuevas historias en comunidad.", "/circulos"],
    ["loan", "Mis préstamos", "Consulta fechas, estados y el historial de tus préstamos.", "/prestamos"],
    ["heart", "Mis favoritos", "Guarda los títulos que no quieres perder de vista.", "/favoritos"],
  ]
  summary = computed<[IconName, number, string, string][]>(() => {
    const mine = this.auth.user()
    const d = this.store.db()
    if (!mine) return []
    return [
      [
        "loan",
        this.loanService.loans().filter((l) => l.userId === mine.id && l.status !== "Devuelto").length,
        "préstamos activos",
        "/prestamos",
      ],
      [
        "clock",
        d.requests.filter((r) => r.userId === mine.id && r.status === "Pendiente").length,
        "solicitudes en espera",
        "/solicitudes",
      ],
      [
        "users",
        d.enrollments.filter((e) => e.userId === mine.id && e.status !== "Cancelada").length,
        "círculos inscritos",
        "/mis-circulos",
      ],
      ["heart", this.catalog.favorites().length, "favoritos guardados", "/favoritos"],
    ]
  })
  submitSearch(event: Event) {
    event.preventDefault()
    const q = this.query()
    this.ui.navigate(`/catalogo${q ? `?q=${encodeURIComponent(q)}` : ""}`)
  }
}
