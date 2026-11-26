import { ButtonComponent } from "@shared/components/button/button.component"
import { FieldComponent } from "@shared/components/field/field.component"
import { Component, inject, signal } from "@angular/core"
import { AuthService, UiService } from "@core/services"
import { demoAccounts } from "@core/constants"
import { AuthShellComponent } from "@layouts/auth-shell/auth-shell.component"

@Component({
  selector: "app-forgot-password",
  imports: [ButtonComponent, AuthShellComponent, FieldComponent],
  templateUrl: "./forgot-password.component.html",
})
export class ForgotPasswordComponent {
  ui = inject(UiService)
  auth = inject(AuthService)
  demo = demoAccounts
  email = signal("")
  sent = signal(false)
  token = signal<string | null>(null)
  submit(event: Event) {
    event.preventDefault()
    if (!this.email().trim()) return this.ui.notify("Escribe tu correo electrónico", "error")
    this.token.set(this.auth.requestReset(this.email()))
    this.sent.set(true)
  }
}
