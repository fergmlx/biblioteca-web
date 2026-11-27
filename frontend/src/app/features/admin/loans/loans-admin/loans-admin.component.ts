import { ButtonComponent } from "@shared/components/button/button.component"
import { EmptyStateComponent } from "@shared/components/empty-state/empty-state.component"
import { SelectComponent } from "@shared/components/select/select.component"
import { AdminSearchComponent } from "@features/admin/shared/components/admin-search/admin-search.component"
import { LoanTableComponent } from "@features/admin/shared/components/loan-table/loan-table.component"
import { MiniStatComponent } from "@features/admin/shared/components/mini-stat/mini-stat.component"
import { TableToolbarComponent } from "@features/admin/shared/components/table-toolbar/table-toolbar.component"
import { Component, computed, inject, signal } from "@angular/core"
import { AuthService, DatabaseStore, LoanService, UiService } from "@core/services"
import type { LoanView } from "@core/models"
import { matches } from "@features/admin/shared/utils/admin.utils"

@Component({
  selector: "app-loans-admin",
  imports: [ButtonComponent, EmptyStateComponent, SelectComponent, AdminSearchComponent, LoanTableComponent, MiniStatComponent, TableToolbarComponent],
  templateUrl: "./loans-admin.component.html",
})
export class LoansAdminComponent {
  ui = inject(UiService)
  auth = inject(AuthService)
  loanService = inject(LoanService)
  store = inject(DatabaseStore)
  states = ["Todos los estados", "En curso", "Atrasado", "Devuelto"]
  search = signal("")
  status = signal("Todos los estados")
  bookTitle(id: number) {
    return this.store.db().books.find((b) => b.id === id)?.title || ""
  }
  rows = computed(() =>
    [...this.loanService.loans()]
      .sort((a, b) => b.id - a.id)
      .filter(
        (l) =>
          matches(`${this.auth.userName(l.userId)} ${this.bookTitle(l.bookId)}`, this.search()) &&
          (this.status() === "Todos los estados" || l.status === this.status()),
      ),
  )
  late = computed(() => this.loanService.loans().filter((l) => l.status === "Atrasado").length)
  activeCount = computed(() => this.loanService.loans().filter((l) => !l.returned).length)
  returnedCount = computed(() => this.loanService.loans().filter((l) => l.returned).length)
  async giveBack(loan: LoanView) {
    const ok = await this.ui.ask({
      title: "Registrar devolución",
      message: `${this.auth.userName(loan.userId)} devuelve "${this.bookTitle(loan.bookId)}". El ejemplar quedará disponible.`,
      confirmLabel: "Registrar devolución",
    })
    if (!ok) return
    this.loanService.returnLoan(loan.id)
    this.ui.notify("Devolución registrada")
  }
}
