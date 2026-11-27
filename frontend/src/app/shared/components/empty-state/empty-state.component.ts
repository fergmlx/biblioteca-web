import { Component, input } from "@angular/core"
import { IconComponent } from "@shared/components/icon/icon.component"

@Component({
  selector: "app-empty-state",
  imports: [IconComponent],
  host: { style: "display: contents" },
  templateUrl: "./empty-state.component.html",
})
export class EmptyStateComponent {
  title = input.required<string>()
  text = input.required<string>()
}
