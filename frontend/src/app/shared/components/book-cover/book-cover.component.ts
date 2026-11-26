import { Component, input } from "@angular/core"

@Component({
  selector: "app-book-cover",
  host: { style: "display: contents" },
  templateUrl: "./book-cover.component.html",
})
export class BookCoverComponent {
  title = input.required<string>()
  color = input.required<string>()
  size = input<"small" | "medium" | "large">("medium")
}
