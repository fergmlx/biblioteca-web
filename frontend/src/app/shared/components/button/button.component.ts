import { Component, input } from "@angular/core"
import type { IconName } from "@shared/components/icon/icons"
import { IconComponent } from "@shared/components/icon/icon.component"

@Component({
  selector: "button[appBtn]",
  imports: [IconComponent],
  host: { "[class]": "'btn btn-' + variant()" },
  templateUrl: "./button.component.html",
})
export class ButtonComponent {
  variant = input<"primary" | "secondary" | "ghost" | "danger">("primary")
  icon = input<IconName | undefined>()
}
