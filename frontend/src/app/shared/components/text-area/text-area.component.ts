import { Component, input, model } from "@angular/core"

@Component({
  selector: "app-textarea",
  host: { style: "display: contents" },
  templateUrl: "./text-area.component.html",
})
export class TextAreaComponent {
  label = input.required<string>()
  placeholder = input("")
  rows = input(4)
  value = model("")
}
