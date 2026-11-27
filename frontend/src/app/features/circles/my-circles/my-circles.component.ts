import { ButtonComponent } from "@shared/components/button/button.component"
import { EmptyStateComponent } from "@shared/components/empty-state/empty-state.component"
import { IconComponent } from "@shared/components/icon/icon.component"
import { PageHeaderComponent } from "@shared/components/page-header/page-header.component"
import { StatusComponent } from "@shared/components/status/status.component"
import { Component, computed, inject } from "@angular/core"
import { AuthService, CircleService, DatabaseStore, UiService } from "@core/services"
import { fmt } from "@core/utils"

@Component({
  selector: "app-my-circles",
  imports: [ButtonComponent, EmptyStateComponent, IconComponent, PageHeaderComponent, StatusComponent],
  templateUrl: "./my-circles.component.html",
})
export class MyCirclesComponent {
  ui = inject(UiService)
  auth = inject(AuthService)
  circleService = inject(CircleService)
  store = inject(DatabaseStore)
  fmt = fmt
  items = computed(() =>
    this.store
      .db()
      .enrollments.filter((e) => e.userId === this.auth.user()?.id)
      .sort((a, b) => b.id - a.id),
  )
  circleOf(id: number) {
    return this.circleService.circles().find((c) => c.id === id)!
  }
  async cancel(id: number, name: string) {
    if (
      await this.ui.ask({
        title: "Cancelar inscripción",
        message: `Liberarás tu lugar en "${name}".`,
        confirmLabel: "Cancelar inscripción",
        tone: "danger",
      })
    ) {
      this.circleService.setEnrollment(id, "Cancelada")
      this.ui.notify("Inscripción cancelada")
    }
  }
}
