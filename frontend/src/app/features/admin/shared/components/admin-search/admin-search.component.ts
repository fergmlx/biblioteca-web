import { IconComponent } from "@shared/components/icon/icon.component"
import { Component, input, model } from "@angular/core"

@Component({
  selector: "app-admin-search",
  imports: [IconComponent],
  host: { style: "display: contents" },
  templateUrl: "./admin-search.component.html",
})
export class AdminSearchComponent {
  value = model("")
  placeholder = input("Buscar...")
}
