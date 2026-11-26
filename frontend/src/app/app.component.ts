import { Component } from "@angular/core"
import { RouterOutlet } from "@angular/router"
import { ConfirmDialogComponent } from "@shared/components/confirm-dialog/confirm-dialog.component"
import { ToastRegionComponent } from "@shared/components/toast-region/toast-region.component"

@Component({
  selector: "app-root",
  imports: [RouterOutlet, ToastRegionComponent, ConfirmDialogComponent],
  template: `
    <router-outlet />
    <app-toast-region />
    <app-confirm-dialog />
  `,
})
export class AppComponent {}
