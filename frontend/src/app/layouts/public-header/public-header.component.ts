import { ButtonComponent } from "@shared/components/button/button.component"
import { IconComponent } from "@shared/components/icon/icon.component"
import { Component, inject, signal } from "@angular/core"
import { AuthService, DatabaseStore, UiService } from "@core/services"
import { initials } from "@core/utils"

@Component({
  selector: "app-public-header",
  imports: [ButtonComponent, IconComponent],
  host: { style: "display: contents" },
  templateUrl: "./public-header.component.html",
})
export class PublicHeaderComponent {
  ui = inject(UiService)
  auth = inject(AuthService)
  store = inject(DatabaseStore)
  initials = initials
  open = signal(false)
  go(path: string) {
    this.ui.navigate(path)
    this.open.set(false)
  }
  links() {
    const mine = this.auth.user()
    const pending = mine
      ? this.store.db().requests.filter((r) => r.userId === mine.id && r.status === "Pendiente").length
      : 0
    const links: [string, string, number?][] = [
      ["/", "Inicio"],
      ["/catalogo", "Catálogo"],
      ["/circulos", "Círculos de lectura"],
    ]
    if (this.auth.role() !== "guest")
      links.push(["/prestamos", "Mis préstamos"], ["/solicitudes", "Solicitudes", pending], ["/favoritos", "Favoritos"])
    return links
  }
  isActive(path: string) {
    const p = this.ui.path()
    return path === "/" ? p === "/" : p.startsWith(path)
  }
}
