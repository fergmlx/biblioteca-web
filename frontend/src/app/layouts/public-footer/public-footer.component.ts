import { IconComponent } from "@shared/components/icon/icon.component"
import { Component, inject } from "@angular/core"
import { AuthService, UiService } from "@core/services"

@Component({
  selector: "app-public-footer",
  imports: [IconComponent],
  host: { style: "display: contents" },
  templateUrl: "./public-footer.component.html",
})
export class PublicFooterComponent {
  ui = inject(UiService)
  auth = inject(AuthService)
}
