import { ButtonComponent } from "@shared/components/button/button.component"
import { EmptyStateComponent } from "@shared/components/empty-state/empty-state.component"
import { Component, inject, input } from "@angular/core"
import { UiService } from "@core/services"

@Component({
  selector: "app-admin-not-found",
  imports: [ButtonComponent, EmptyStateComponent],
  host: { style: "display: contents" },
  templateUrl: "./admin-not-found.component.html",
})
export class AdminNotFoundComponent {
  ui = inject(UiService)
  what = input.required<string>()
  back = input.required<string>()
  to = input.required<string>()
}
