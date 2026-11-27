import { ButtonComponent } from "@shared/components/button/button.component"
import { BookCoverComponent } from "@shared/components/book-cover/book-cover.component"
import { EmptyStateComponent } from "@shared/components/empty-state/empty-state.component"
import { IconComponent } from "@shared/components/icon/icon.component"
import { PageHeaderComponent } from "@shared/components/page-header/page-header.component"
import { StatusComponent } from "@shared/components/status/status.component"
import { Component, computed, inject, signal } from "@angular/core"
import { AuthService, CatalogService, DatabaseStore, LoanService, UiService } from "@core/services"
import { iso, fmt } from "@core/utils"
import { DataTableComponent } from "@shared/components/data-table/data-table.component"

@Component({
  selector: "app-loans",
  imports: [ButtonComponent, DataTableComponent, BookCoverComponent, EmptyStateComponent, IconComponent, PageHeaderComponent, StatusComponent],
  templateUrl: "./loans.component.html",
})
export class LoansComponent {
  ui = inject(UiService)
  auth = inject(AuthService)
  catalog = inject(CatalogService)
  loanService = inject(LoanService)
  store = inject(DatabaseStore)
  fmt = fmt
  tab = signal("Actuales")
  own = computed(() => {
    const u = this.auth.user()
    return this.loanService
      .loans()
      .filter((l) => l.userId === u?.id)
      .sort((a, b) => b.date.localeCompare(a.date))
  })
  pending = computed(() =>
    this.store.db().requests.filter((r) => r.userId === this.auth.user()?.id && r.status === "Pendiente"),
  )
  visible = computed(() =>
    this.own().filter(
      (l) => this.tab() === "Todos" || (this.tab() === "Actuales" ? l.status !== "Devuelto" : l.status === "Devuelto"),
    ),
  )
  bookOf(id: number) {
    return this.catalog.books().find((b) => b.id === id)!
  }
  daysLeft(due: string) {
    return Math.round((new Date(due).getTime() - new Date(iso()).getTime()) / 86400000)
  }
  canRenew(loan: { status: string; due: string; date: string }) {
    return loan.status === "En curso" && (new Date(loan.due).getTime() - new Date(loan.date).getTime()) / 86400000 <= 14
  }
  async renew(id: number, title: string) {
    if (
      await this.ui.ask({
        title: "Renovar préstamo",
        message: `Se extenderá 7 días la fecha límite de "${title}".`,
        confirmLabel: "Renovar",
      })
    ) {
      this.loanService.renewLoan(id)
      this.ui.notify("Préstamo renovado por 7 días")
    }
  }
}
