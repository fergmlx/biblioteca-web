import { Component, HostListener, input, output } from "@angular/core"
import { IconComponent } from "@shared/components/icon/icon.component"

@Component({
  selector: "app-modal",
  imports: [IconComponent],
  host: { style: "display: contents" },
  templateUrl: "./modal.component.html",
})
export class ModalComponent {
  title = input.required<string>()
  wide = input(false)
  admin = input(false)
  closed = output<void>()
  @HostListener("window:keydown", ["$event"])
  onKey(event: KeyboardEvent) {
    if (event.key === "Escape") this.closed.emit()
  }
}
