import { IconComponent } from "@shared/components/icon/icon.component"
import { Component, booleanAttribute, input, output } from "@angular/core"

@Component({
  selector: "app-actions",
  imports: [IconComponent],
  host: { style: "display: contents" },
  templateUrl: "./actions.component.html",
})
export class ActionsComponent {
  view = input(false, { transform: booleanAttribute })
  edit = input(false, { transform: booleanAttribute })
  toggle = input(false, { transform: booleanAttribute })
  del = input(false, { transform: booleanAttribute })
  active = input(true)
  viewed = output<void>()
  edited = output<void>()
  toggled = output<void>()
  deleted = output<void>()
}
