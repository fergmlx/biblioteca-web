import { ButtonComponent } from "@shared/components/button/button.component"
import { BookCoverComponent } from "@shared/components/book-cover/book-cover.component"
import { EmptyStateComponent } from "@shared/components/empty-state/empty-state.component"
import { PageHeaderComponent } from "@shared/components/page-header/page-header.component"
import { StatusComponent } from "@shared/components/status/status.component"
import { Component, computed, inject } from "@angular/core"
import { AuthService, CatalogService, DatabaseStore, LoanService, UiService } from "@core/services"
import { fmt } from "@core/utils"

@Component({
  selector: "app-requests",
  imports: [ButtonComponent, BookCoverComponent, EmptyStateComponent, PageHeaderComponent, StatusComponent],
  templateUrl: "./requests.component.html",
})
export class RequestsComponent {
  ui = inject(UiService)
  auth = inject(AuthService)
  catalog = inject(CatalogService)
  loanService = inject(LoanService)
  store = inject(DatabaseStore)
  fmt = fmt
  items = computed(() =>
    this.store
      .db()
      .requests.filter((r) => r.userId === this.auth.user()?.id)
      .sort((a, b) => b.id - a.id),
  )
  bookOf(id: number) {
    return this.catalog.books().find((b) => b.id === id)!
  }
  async cancel(id: number, title: string) {
    if (
      await this.ui.ask({
        title: "Cancelar solicitud",
        message: `Dejarás de esperar respuesta por "${title}".`,
        confirmLabel: "Cancelar solicitud",
        tone: "danger",
      })
    ) {
      this.loanService.cancelRequest(id)
      this.ui.notify("Solicitud cancelada")
    }
  }
}
