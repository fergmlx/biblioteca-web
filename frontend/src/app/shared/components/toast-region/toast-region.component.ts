import { Component, inject } from "@angular/core"
import { UiService } from "@core/services"
import { IconComponent } from "../icon/icon.component"

@Component({
  selector: "app-toast-region",
  imports: [IconComponent],
  templateUrl: "./toast-region.component.html",
})
export class ToastRegionComponent {
  ui = inject(UiService)
}
