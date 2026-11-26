import { EmptyStateComponent } from "@shared/components/empty-state/empty-state.component"
import { SelectComponent } from "@shared/components/select/select.component"
import { StatusComponent } from "@shared/components/status/status.component"
import { ActionsComponent } from "@features/admin/shared/components/actions/actions.component"
import { AdminSearchComponent } from "@features/admin/shared/components/admin-search/admin-search.component"
import { DataCardComponent } from "@features/admin/shared/components/data-card/data-card.component"
import { TableToolbarComponent } from "@features/admin/shared/components/table-toolbar/table-toolbar.component"
import { Component, computed, inject, signal } from "@angular/core"
import { AuthService, DatabaseStore, LoanService, UiService } from "@core/services"
import type { Account } from "@core/models"
import { matches } from "@features/admin/shared/utils/admin.utils"

@Component({
  selector: "app-users-admin",
  imports: [EmptyStateComponent, SelectComponent, StatusComponent, ActionsComponent, AdminSearchComponent, DataCardComponent, TableToolbarComponent],
  templateUrl: "./users-admin.component.html",
})
export class UsersAdminComponent {
  ui = inject(UiService)
  auth = inject(AuthService)
  loanService = inject(LoanService)
  store = inject(DatabaseStore)
  roles = ["Todos los roles", "Usuario", "Administrador"]
  search = signal("")
  role = signal("Todos los roles")
  data = computed(() =>
    this.store
      .db()
      .accounts.filter(
        (a) =>
          matches(`${a.name} ${a.last} ${a.email} ${a.member}`, this.search()) &&
          (this.role() === "Todos los roles" || a.role === this.role()),
      ),
  )
  activeLoans(id: number) {
    return this.loanService.loans().filter((l) => l.userId === id && !l.returned).length
  }
  async toggle(account: Account) {
    if (account.id === this.auth.user()?.id && account.active)
      return this.ui.notify("No puedes desactivar tu propia cuenta", "error")
    const ok = await this.ui.ask({
      title: account.active ? "Desactivar cuenta" : "Activar cuenta",
      message: account.active
        ? `${account.name} ${account.last} ya no podrá iniciar sesión.`
        : `${account.name} ${account.last} podrá volver a iniciar sesión.`,
      confirmLabel: account.active ? "Desactivar" : "Activar",
      tone: account.active ? "danger" : "default",
    })
    if (!ok) return
    this.auth.toggleAccount(account.id)
    this.ui.notify(account.active ? "Cuenta desactivada" : "Cuenta activada")
  }
}
