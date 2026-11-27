import { Component, inject, input } from "@angular/core"
import { AuthService, UiService } from "@core/services"

@Component({
  selector: "app-user-link",
  host: { style: "display: contents" },
  templateUrl: "./user-link.component.html",
})
export class UserLinkComponent {
  ui = inject(UiService)
  auth = inject(AuthService)
  id = input.required<number>()
}
