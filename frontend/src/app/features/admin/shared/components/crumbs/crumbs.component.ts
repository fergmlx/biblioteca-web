import { Component, inject, input } from "@angular/core"
import { UiService } from "@core/services"

@Component({
  selector: "app-crumbs",
  host: { style: "display: contents" },
  templateUrl: "./crumbs.component.html",
})
export class CrumbsComponent {
  ui = inject(UiService)
  items = input.required<{ label: string; to?: string }[]>()
}
