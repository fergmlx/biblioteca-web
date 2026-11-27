import { Component, computed, input, model } from "@angular/core"

export type Option = string | { value: string; label: string }

@Component({
  selector: "app-select",
  host: { style: "display: contents" },
  templateUrl: "./select.component.html",
})
export class SelectComponent {
  label = input<string>()
  options = input.required<Option[]>()
  value = model("")
  items = computed(() => this.options().map((o) => (typeof o === "string" ? { value: o, label: o } : o)))
}
