import { ButtonComponent } from "@shared/components/button/button.component"
import { FieldComponent } from "@shared/components/field/field.component"
import { StatusComponent } from "@shared/components/status/status.component"
import { Component, inject, signal } from "@angular/core"
import { AuthService, UiService } from "@core/services"
import { fmt, initials } from "@core/utils"

@Component({
  selector: "app-admin-profile",
  imports: [ButtonComponent, FieldComponent, StatusComponent],
  templateUrl: "./admin-profile.component.html",
})
export class AdminProfileComponent {
  ui = inject(UiService)
  auth = inject(AuthService)
  initials = initials
  fmt = fmt
  editing = signal(false)
  name = signal(this.auth.user()?.name ?? "")
  last = signal(this.auth.user()?.last ?? "")
  phone = signal(this.auth.user()?.phone ?? "")
  save() {
    if (!this.name().trim() || !this.last().trim())
      return this.ui.notify("Nombre y apellidos son obligatorios", "error")
    this.auth.updateProfile({ name: this.name(), last: this.last(), phone: this.phone() })
    this.editing.set(false)
    this.ui.notify("Tus datos fueron actualizados")
  }
  async logout() {
    if (
      await this.ui.ask({
        title: "Cerrar sesión",
        message: "¿Deseas salir del panel administrativo?",
        confirmLabel: "Cerrar sesión",
      })
    ) {
      this.auth.logout()
      this.ui.navigate("/")
      this.ui.notify("Sesión administrativa cerrada")
    }
  }
}
