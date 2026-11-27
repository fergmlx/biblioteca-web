import { Component, input } from "@angular/core"

@Component({
  selector: "app-data-card",
  host: { style: "display: contents" },
  templateUrl: "./data-card.component.html",
})
export class DataCardComponent {
  headers = input.required<string[]>()
  isEmpty = input(false)
}
