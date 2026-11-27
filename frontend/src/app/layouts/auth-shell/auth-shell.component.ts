import { IconComponent } from "@shared/components/icon/icon.component"
import { Component, inject } from "@angular/core"
import { UiService } from "@core/services"

@Component({
  selector: "app-auth-shell",
  imports: [IconComponent],
  host: { style: "display: contents" },
  templateUrl: "./auth-shell.component.html",
})
export class AuthShellComponent {
  ui = inject(UiService)
}
