import { Component, computed, input } from "@angular/core"

@Component({
  selector: "app-status",
  host: { style: "display: contents" },
  templateUrl: "./status.component.html",
})
export class StatusComponent {
  text = input.required<string>()
  key = computed(() => this.text().toLowerCase().replace(/\s+/g, "-"))
}
