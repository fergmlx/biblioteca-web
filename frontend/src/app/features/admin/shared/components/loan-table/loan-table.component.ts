import { ButtonComponent } from "@shared/components/button/button.component"
import { StatusComponent } from "@shared/components/status/status.component"
import { Component, computed, inject, input, output } from "@angular/core"
import { DatabaseStore, UiService } from "@core/services"
import type { LoanView } from "@core/models"
import { fmt } from "@core/utils"
import { ActionsComponent } from "@features/admin/shared/components/actions/actions.component"
import { UserLinkComponent } from "@features/admin/shared/components/user-link/user-link.component"

@Component({
  selector: "app-loan-table",
  imports: [ButtonComponent, UserLinkComponent, ActionsComponent, StatusComponent],
  host: { style: "display: contents" },
  templateUrl: "./loan-table.component.html",
})
export class LoanTableComponent {
  ui = inject(UiService)
  store = inject(DatabaseStore)
  fmt = fmt
  rows = input.required<LoanView[]>()
  compact = input(false)
  returned = output<LoanView>()
  headers = computed(() => [
    "Usuario",
    "Libro",
    "Ejemplar",
    "Fecha préstamo",
    "Fecha límite",
    ...(this.compact() ? [] : ["Devolución"]),
    "Estado",
    ...(this.compact() ? [] : ["Acciones"]),
  ])
  bookTitle(id: number) {
    return this.store.db().books.find((b) => b.id === id)?.title || "Libro eliminado"
  }
  copyCode(loan: LoanView) {
    return (
      this.store.db().copies.find((c) => c.bookId === loan.bookId && c.number === loan.copy)?.code || `#${loan.copy}`
    )
  }
}
