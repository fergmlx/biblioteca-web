import { ButtonComponent } from "@shared/components/button/button.component"
import { EmptyStateComponent } from "@shared/components/empty-state/empty-state.component"
import { Component, inject } from "@angular/core"
import { UiService } from "@core/services"

@Component({
  selector: "app-not-found",
  imports: [ButtonComponent, EmptyStateComponent],
  host: { style: "display: contents" },
  templateUrl: "./not-found.component.html",
})
export class NotFoundComponent {
  ui = inject(UiService)
}
