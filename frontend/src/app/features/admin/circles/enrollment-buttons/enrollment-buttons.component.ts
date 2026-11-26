import { ButtonComponent } from "@shared/components/button/button.component"
import { Component, inject, input } from "@angular/core"
import { AuthService, CircleService, UiService } from "@core/services"
import type { Enrollment } from "@core/models"

@Component({
  imports: [ButtonComponent],
  selector: "app-enrollment-buttons",
  host: { style: "display: contents" },
  templateUrl: "./enrollment-buttons.component.html",
})
export class EnrollmentButtonsComponent {
  ui = inject(UiService)
  auth = inject(AuthService)
  circleService = inject(CircleService)
  enrollment = input.required<Enrollment>()
  confirm() {
    const e = this.enrollment()
    const circle = this.circleService.circles().find((c) => c.id === e.circleId)
    // Un inscrito pendiente ya ocupa lugar; solo se bloquea al reactivar una cancelada sin cupo.
    if (e.status === "Cancelada" && (!circle || circle.seatsLeft <= 0))
      return this.ui.notify("El círculo no tiene lugares disponibles", "error")
    this.circleService.setEnrollment(e.id, "Activa")
    this.ui.notify(e.status === "Cancelada" ? "Inscripción reactivada" : "Inscripción confirmada")
  }
  async cancel() {
    const e = this.enrollment()
    const ok = await this.ui.ask({
      title: "Cancelar inscripción",
      message: `Se cancelará la inscripción de ${this.auth.userName(e.userId)}. Su lugar quedará libre.`,
      confirmLabel: "Cancelar inscripción",
      tone: "danger",
    })
    if (!ok) return
    this.circleService.setEnrollment(e.id, "Cancelada")
    this.ui.notify("Inscripción cancelada")
  }
}
