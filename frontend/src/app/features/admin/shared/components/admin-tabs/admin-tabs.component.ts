import { Component, input, model } from "@angular/core"

@Component({
  selector: "app-admin-tabs",
  host: { style: "display: contents" },
  templateUrl: "./admin-tabs.component.html",
})
export class AdminTabsComponent {
  tabs = input.required<{ id: string; label: string; count?: number }[]>()
  value = model("")
}
