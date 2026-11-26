import { Component, inject } from "@angular/core"
import { UiService } from "@core/services"
import { ModalComponent } from "../modal/modal.component"

/** Diálogo de confirmación global; se abre con `UiService.ask()`. */
@Component({
  selector: "app-confirm-dialog",
  imports: [ModalComponent],
  templateUrl: "./confirm-dialog.component.html",
})
export class ConfirmDialogComponent {
  ui = inject(UiService)
}
