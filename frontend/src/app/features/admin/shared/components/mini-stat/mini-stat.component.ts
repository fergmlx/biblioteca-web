import { Component, input } from "@angular/core"

@Component({
  selector: "app-mini-stat",
  host: { style: "display: contents" },
  templateUrl: "./mini-stat.component.html",
})
export class MiniStatComponent {
  label = input.required<string>()
  value = input.required<number | string>()
  danger = input(false)
}
