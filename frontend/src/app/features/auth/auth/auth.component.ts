import { ButtonComponent } from "@shared/components/button/button.component"
import { FieldComponent } from "@shared/components/field/field.component"
import { IconComponent } from "@shared/components/icon/icon.component"
import { Component, computed, inject, input, signal } from "@angular/core"
import { AuthService, UiService } from "@core/services"

const passwordRules = [
  { label: "Mínimo 8 caracteres", test: (v: string) => v.length >= 8 },
  { label: "Una letra mayúscula", test: (v: string) => /[A-ZÁÉÍÓÚÑ]/.test(v) },
  { label: "Una letra minúscula", test: (v: string) => /[a-záéíóúñ]/.test(v) },
  { label: "Un número", test: (v: string) => /\d/.test(v) },
  { label: "Un carácter especial (!@#$%…)", test: (v: string) => /[^A-Za-z0-9áéíóúñÁÉÍÓÚÑ]/.test(v) },
]

/** Login y registro comparten componente; la ruta indica el modo (data: { mode }). */

@Component({
  selector: "app-auth",
  imports: [ButtonComponent, FieldComponent, IconComponent],
  templateUrl: "./auth.component.html",
})
export class AuthComponent {
  ui = inject(UiService)
  auth = inject(AuthService)
  mode = input<"login" | "register">("login")
  isLogin = computed(() => this.mode() === "login")
  rules = passwordRules
  values = signal<Record<string, string>>({})
  errors = signal<Record<string, string>>({})
  formError = signal("")
  v(key: string) {
    return this.values()[key] || ""
  }
  set(key: string, value: string) {
    this.values.update((x) => ({ ...x, [key]: value }))
    this.formError.set("")
  }
  submit(event: Event) {
    event.preventDefault()
    const values = this.values()
    const next = this.ui.query().get("next")
    const required = this.isLogin()
      ? ["email", "password"]
      : ["name", "last", "maternal", "email", "phone", "password", "confirm"]
    const errs: Record<string, string> = {}
    required.forEach((k) => {
      if (!values[k]?.trim()) errs[k] = "Obligatorio"
    })
    if (!this.isLogin() && values["password"]) {
      if (!passwordRules.every((r) => r.test(values["password"]))) errs["password"] = "No cumple con las reglas"
      else if (values["confirm"] && values["confirm"] !== values["password"])
        errs["confirm"] = "Las contraseñas no coinciden"
    }
    this.errors.set(errs)
    if (Object.keys(errs).length) return
    if (this.isLogin()) {
      const result = this.auth.login(values["email"], values["password"])
      if (!result.ok) return this.formError.set(result.message || "No se pudo iniciar sesión")
      this.ui.notify(result.role === "admin" ? "Bienvenido al panel administrativo" : "Sesión iniciada correctamente")
      if (result.role === "admin") this.ui.navigate(next?.startsWith("/admin") ? next : "/admin")
      else this.ui.navigate(next && !next.startsWith("/admin") ? next : "/perfil")
      return
    }
    const result = this.auth.register({ ...values, last: `${values["last"].trim()} ${values["maternal"].trim()}` })
    if (!result.ok) return this.formError.set(result.message || "No se pudo crear la cuenta")
    this.ui.notify("Cuenta creada. Te damos la bienvenida")
    this.ui.navigate(next || "/perfil")
  }
}
