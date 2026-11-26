import { ButtonComponent } from "@shared/components/button/button.component"
import { EmptyStateComponent } from "@shared/components/empty-state/empty-state.component"
import { StarsComponent } from "@shared/components/stars/stars.component"
import { StatusComponent } from "@shared/components/status/status.component"
import { AdminNotFoundComponent } from "@features/admin/shared/components/admin-not-found/admin-not-found.component"
import { AdminTabsComponent } from "@features/admin/shared/components/admin-tabs/admin-tabs.component"
import { CrumbsComponent } from "@features/admin/shared/components/crumbs/crumbs.component"
import { LoanTableComponent } from "@features/admin/shared/components/loan-table/loan-table.component"
import { MiniStatComponent } from "@features/admin/shared/components/mini-stat/mini-stat.component"
import { Component, computed, inject, input, signal } from "@angular/core"
import { DatabaseStore, LoanService, UiService } from "@core/services"
import type { LoanView } from "@core/models"
import { fmt, initials } from "@core/utils"

@Component({
  selector: "app-user-detail",
  imports: [ButtonComponent, EmptyStateComponent, StarsComponent, StatusComponent, AdminNotFoundComponent, AdminTabsComponent, CrumbsComponent, LoanTableComponent, MiniStatComponent],
  templateUrl: "./user-detail.component.html",
})
export class UserDetailComponent {
  ui = inject(UiService)
  loanService = inject(LoanService)
  store = inject(DatabaseStore)
  id = input<string>()
  initials = initials
  fmt = fmt
  tab = signal("loans")
  account = computed(() => this.store.db().accounts.find((a) => a.id === Number(this.id())))
  loans = computed(() =>
    this.loanService
      .loans()
      .filter((l) => l.userId === this.account()?.id)
      .sort((a, b) => b.id - a.id),
  )
  requests = computed(() => this.store.db().requests.filter((r) => r.userId === this.account()?.id))
  enrollments = computed(() => this.store.db().enrollments.filter((e) => e.userId === this.account()?.id))
  reviews = computed(() => this.store.db().reviews.filter((r) => r.userId === this.account()?.id))
  activeCount = computed(() => this.loans().filter((l) => !l.returned).length)
  lateCount = computed(() => this.loans().filter((l) => l.status === "Atrasado").length)
  circlesCount = computed(() => this.enrollments().filter((e) => e.status !== "Cancelada").length)
  tabs = computed(() => [
    { id: "loans", label: "Préstamos", count: this.loans().length },
    { id: "requests", label: "Solicitudes", count: this.requests().length },
    { id: "circles", label: "Círculos", count: this.enrollments().length },
    { id: "reviews", label: "Reseñas", count: this.reviews().length },
  ])
  bookTitle(id: number) {
    return this.store.db().books.find((b) => b.id === id)?.title || "Libro eliminado"
  }
  circleName(id: number) {
    return this.store.db().circles.find((c) => c.id === id)?.name || "Círculo eliminado"
  }
  async giveBack(loan: LoanView) {
    const ok = await this.ui.ask({
      title: "Registrar devolución",
      message: `¿Confirmas la devolución de "${this.bookTitle(loan.bookId)}"?`,
      confirmLabel: "Registrar devolución",
    })
    if (!ok) return
    this.loanService.returnLoan(loan.id)
    this.ui.notify("Devolución registrada")
  }
}
