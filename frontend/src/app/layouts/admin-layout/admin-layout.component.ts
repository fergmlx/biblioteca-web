import type { IconName } from "@shared/components/icon/icons"
import { IconComponent } from "@shared/components/icon/icon.component"
import { Component, computed, inject, signal } from "@angular/core"
import { RouterOutlet } from "@angular/router"
import { AuthService, DatabaseStore, UiService } from "@core/services"
import { initials } from "@core/utils"

type NavItem = [IconName, string, string, "requests" | "enrollments" | null]

const adminNavigation: { group: string; items: NavItem[] }[] = [
  { group: "General", items: [["chart", "Panel general", "/admin", null]] },
  {
    group: "Catálogo",
    items: [
      ["book", "Libros", "/admin/libros", null],
      ["copy", "Ejemplares", "/admin/ejemplares", null],
      ["user", "Autores", "/admin/autores", null],
      ["settings", "Géneros", "/admin/generos", null],
    ],
  },
  {
    group: "Circulación",
    items: [
      ["clock", "Solicitudes", "/admin/solicitudes", "requests"],
      ["loan", "Préstamos", "/admin/prestamos", null],
    ],
  },
  {
    group: "Comunidad",
    items: [
      ["users", "Usuarios", "/admin/usuarios", null],
      ["users", "Círculos de lectura", "/admin/circulos", null],
      ["calendar", "Inscripciones", "/admin/inscripciones", "enrollments"],
      ["heart", "Reseñas", "/admin/resenas", null],
    ],
  },
  { group: "Análisis", items: [["download", "Reportes", "/admin/reportes", null]] },
]

@Component({
  selector: "app-admin-layout",
  imports: [RouterOutlet, IconComponent],
  templateUrl: "./admin-layout.component.html",
})
export class AdminLayoutComponent {
  ui = inject(UiService)
  auth = inject(AuthService)
  store = inject(DatabaseStore)
  initials = initials
  nav = adminNavigation
  mobileOpen = signal(false)
  badges = computed(() => ({
    requests: this.store.db().requests.filter((r) => r.status === "Pendiente").length,
    enrollments: this.store.db().enrollments.filter((e) => e.status === "Pendiente").length,
  }))
  isActive(path: string) {
    const p = this.ui.path()
    return path === "/admin" ? p === "/admin" : p.startsWith(path)
  }
  go(path: string) {
    this.ui.navigate(path)
    this.mobileOpen.set(false)
  }
  async logout() {
    const ok = await this.ui.ask({
      title: "Cerrar sesión",
      message: "¿Deseas salir del panel administrativo?",
      confirmLabel: "Cerrar sesión",
    })
    if (!ok) return
    this.auth.logout()
    this.ui.navigate("/")
    this.ui.notify("Sesión administrativa cerrada")
  }
}
