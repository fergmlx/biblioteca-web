import { Component, input, model, signal } from "@angular/core"

@Component({
  selector: "app-field",
  host: { style: "display: contents" },
  templateUrl: "./field.component.html",
})
export class FieldComponent {
  label = input.required<string>()
  type = input("text")
  placeholder = input("")
  required = input(false)
  disabled = input(false)
  error = input<string>()
  value = model("")
  shown = signal(false)
}
