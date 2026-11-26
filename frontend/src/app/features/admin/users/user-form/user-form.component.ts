import { ButtonComponent } from "@shared/components/button/button.component"
import { FieldComponent } from "@shared/components/field/field.component"
import { PageHeaderComponent } from "@shared/components/page-header/page-header.component"
import { SelectComponent } from "@shared/components/select/select.component"
import { AdminNotFoundComponent } from "@features/admin/shared/components/admin-not-found/admin-not-found.component"
import { CrumbsComponent } from "@features/admin/shared/components/crumbs/crumbs.component"
import { Component, OnInit, computed, inject, input, signal } from "@angular/core"
import { AuthService, DatabaseStore, UiService } from "@core/services"
import type { Account } from "@core/models"

@Component({
  selector: "app-user-form",
  imports: [ButtonComponent, FieldComponent, PageHeaderComponent, SelectComponent, AdminNotFoundComponent, CrumbsComponent],
  templateUrl: "./user-form.component.html",
})
export class UserFormComponent implements OnInit {
  ui = inject(UiService)
  auth = inject(AuthService)
  store = inject(DatabaseStore)
  id = input<string>()
  account = computed(() => this.store.db().accounts.find((a) => a.id === Number(this.id())) ?? null)
  missing = computed(() => !!this.id() && !this.account())
  f = signal({ member: "", name: "", last: "", email: "", phone: "", password: "", role: "Usuario", state: "Activo" })
  crumbs = computed(() => {
    const a = this.account()
    return [
      { label: "Usuarios", to: "/admin/usuarios" },
      ...(a ? [{ label: `${a.name} ${a.last}`, to: `/admin/usuarios/${a.id}` }] : []),
      { label: a ? "Editar" : "Nuevo usuario" },
    ]
  })
  ngOnInit() {
    const a = this.account()
    if (a) {
      this.f.set({
        member: a.member,
        name: a.name,
        last: a.last,
        email: a.email,
        phone: a.phone,
        password: "",
        role: a.role,
        state: a.active ? "Activo" : "Inactivo",
      })
    } else {
      const next = String(this.store.db().accounts.reduce((m, x) => Math.max(m, Number(x.member) || 0), 2023000) + 1)
      this.f.update((c) => ({ ...c, member: next }))
    }
  }
  set(key: string, value: string) {
    this.f.update((c) => ({ ...c, [key]: value }))
  }
  submit(event: Event) {
    event.preventDefault()
    const f = this.f(),
      account = this.account()
    if (!f.member.trim() || !f.name.trim() || !f.last.trim() || !f.email.trim())
      return this.ui.notify("Completa los campos obligatorios", "error")
    if (!account && !f.password) return this.ui.notify("La contraseña es obligatoria al crear", "error")
    if (account && account.id === this.auth.user()?.id && f.state === "Inactivo")
      return this.ui.notify("No puedes desactivar tu propia cuenta", "error")
    const result = this.auth.saveAccount({
      id: account?.id,
      member: f.member.trim(),
      name: f.name.trim(),
      last: f.last.trim(),
      email: f.email.trim(),
      phone: f.phone.trim(),
      password: f.password || account?.password || "",
      role: f.role as Account["role"],
      active: f.state === "Activo",
    })
    if (!result.ok) return this.ui.notify(result.message || "No se pudo guardar", "error")
    this.ui.notify(account ? "Usuario actualizado" : "Usuario creado correctamente")
    this.ui.navigate(account ? `/admin/usuarios/${account.id}` : "/admin/usuarios")
  }
}
