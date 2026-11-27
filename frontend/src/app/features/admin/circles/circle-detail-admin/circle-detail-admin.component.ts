import { ButtonComponent } from "@shared/components/button/button.component"
import { EmptyStateComponent } from "@shared/components/empty-state/empty-state.component"
import { PageHeaderComponent } from "@shared/components/page-header/page-header.component"
import { StatusComponent } from "@shared/components/status/status.component"
import { AdminNotFoundComponent } from "@features/admin/shared/components/admin-not-found/admin-not-found.component"
import { CrumbsComponent } from "@features/admin/shared/components/crumbs/crumbs.component"
import { MiniStatComponent } from "@features/admin/shared/components/mini-stat/mini-stat.component"
import { UserLinkComponent } from "@features/admin/shared/components/user-link/user-link.component"
import { Component, computed, inject, input } from "@angular/core"
import { CircleService, DatabaseStore, UiService } from "@core/services"
import { fmt } from "@core/utils"
import { EnrollmentButtonsComponent } from "@features/admin/circles/enrollment-buttons/enrollment-buttons.component"

@Component({
  selector: "app-circle-detail-admin",
  imports: [ButtonComponent, EnrollmentButtonsComponent, EmptyStateComponent, PageHeaderComponent, StatusComponent, AdminNotFoundComponent, CrumbsComponent, MiniStatComponent, UserLinkComponent],
  templateUrl: "./circle-detail-admin.component.html",
})
export class CircleDetailAdminComponent {
  ui = inject(UiService)
  circleService = inject(CircleService)
  store = inject(DatabaseStore)
  fmt = fmt
  id = input<string>()
  circle = computed(() => this.circleService.circles().find((c) => c.id === Number(this.id())))
  book = computed(() => this.store.db().books.find((b) => b.id === this.circle()?.bookId))
  members = computed(() => this.store.db().enrollments.filter((e) => e.circleId === this.circle()?.id))
  pct = computed(() => {
    const c = this.circle()
    return c ? Math.min(100, Math.round((c.enrolled / Math.max(c.capacity, 1)) * 100)) : 0
  })
}
