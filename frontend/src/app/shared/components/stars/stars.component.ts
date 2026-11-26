import { Component, computed, input, output } from "@angular/core"

@Component({
  selector: "app-stars",
  host: { style: "display: contents" },
  templateUrl: "./stars.component.html",
})
export class StarsComponent {
  value = input(0)
  size = input(18)
  editable = input(false)
  valueChange = output<number>()
  round = computed(() => Math.round(this.value()))
}
