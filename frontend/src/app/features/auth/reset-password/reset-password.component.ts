import { ButtonComponent } from "@shared/components/button/button.component"
import { FieldComponent } from "@shared/components/field/field.component"
import { Component, computed, inject, signal } from "@angular/core"
import { AuthService, DatabaseStore, UiService } from "@core/services"
import { AuthShellComponent } from "@layouts/auth-shell/auth-shell.component"

@Component({
  selector: "app-reset-password",
  imports: [ButtonComponent, AuthShellComponent, FieldComponent],
  templateUrl: "./reset-password.component.html",
})
export class ResetPasswordComponent {
  ui = inject(UiService)
  auth = inject(AuthService)
  store = inject(DatabaseStore)
  password = signal("")
  confirm = signal("")
  token = computed(() => this.ui.query().get("token") || "")
  owner = computed(() => {
    this.store.db()
    return this.auth.tokenOwner(this.token())
  })
  submit(event: Event) {
    event.preventDefault()
    if (!this.password() || this.password() !== this.confirm())
      return this.ui.notify("Las contraseñas no coinciden", "error")
    if (this.auth.resetPassword(this.token(), this.password())) {
      this.ui.notify("Contraseña actualizada. Ya puedes ingresar")
      this.ui.navigate("/login")
    }
  }
}
