import { ButtonComponent } from "@shared/components/button/button.component"
import { PageHeaderComponent } from "@shared/components/page-header/page-header.component"
import { Component, input, output } from "@angular/core"
import type { IconName } from "@shared/components/icon/icons"

@Component({
  selector: "app-table-toolbar",
  imports: [ButtonComponent, PageHeaderComponent],
  host: { style: "display: contents" },
  templateUrl: "./table-toolbar.component.html",
})
export class TableToolbarComponent {
  title = input.required<string>()
  description = input.required<string>()
  action = input<string>()
  icon = input<IconName>("plus")
  act = output<void>()
  hasExtra = true
}
