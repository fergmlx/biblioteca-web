import { ButtonComponent } from "@shared/components/button/button.component"
import { EmptyStateComponent } from "@shared/components/empty-state/empty-state.component"
import { IconComponent } from "@shared/components/icon/icon.component"
import { PageHeaderComponent } from "@shared/components/page-header/page-header.component"
import { StatusComponent } from "@shared/components/status/status.component"
import { Component, computed, inject } from "@angular/core"
import { AuthService, CatalogService, CircleService, DatabaseStore, UiService } from "@core/services"

@Component({
  selector: "app-circles",
  imports: [ButtonComponent, EmptyStateComponent, IconComponent, PageHeaderComponent, StatusComponent],
  templateUrl: "./circles.component.html",
})
export class CirclesComponent {
  ui = inject(UiService)
  auth = inject(AuthService)
  catalog = inject(CatalogService)
  circleService = inject(CircleService)
  store = inject(DatabaseStore)
  circles = computed(() => this.circleService.circles().filter((c) => c.active))
  enrollmentOf(circleId: number) {
    const u = this.auth.user()
    return u
      ? this.store
          .db()
          .enrollments.find((e) => e.userId === u.id && e.circleId === circleId && e.status !== "Cancelada")
      : undefined
  }
  bookOf(id: number | null) {
    return this.catalog.books().find((b) => b.id === id)
  }
  pct(a: number, b: number) {
    return Math.min((a / b) * 100, 100)
  }
}
