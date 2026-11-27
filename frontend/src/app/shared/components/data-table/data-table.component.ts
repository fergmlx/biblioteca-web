import { Component, input } from "@angular/core"

@Component({
  selector: "app-data-table",
  host: { style: "display: contents" },
  templateUrl: "./data-table.component.html",
})
export class DataTableComponent {
  headers = input.required<string[]>()
}
