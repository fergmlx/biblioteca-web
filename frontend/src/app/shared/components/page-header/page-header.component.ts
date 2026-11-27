import { Component, input } from "@angular/core"

@Component({
  selector: "app-page-header",
  host: { style: "display: contents" },
  templateUrl: "./page-header.component.html",
})
export class PageHeaderComponent {
  eyebrow = input<string>()
  title = input.required<string>()
  description = input<string>()
}
