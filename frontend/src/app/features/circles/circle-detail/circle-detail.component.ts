import { ButtonComponent } from "@shared/components/button/button.component"
import { BookCoverComponent } from "@shared/components/book-cover/book-cover.component"
import { IconComponent } from "@shared/components/icon/icon.component"
import { ModalComponent } from "@shared/components/modal/modal.component"
import { StatusComponent } from "@shared/components/status/status.component"
import { Component, computed, inject, input, signal } from "@angular/core"
import { AuthService, CatalogService, CircleService, DatabaseStore, UiService } from "@core/services"
import { fmt } from "@core/utils"
import { NotFoundComponent } from "@shared/components/not-found/not-found.component"

@Component({
  selector: "app-circle-detail",
  imports: [ButtonComponent, NotFoundComponent, BookCoverComponent, IconComponent, ModalComponent, StatusComponent],
  templateUrl: "./circle-detail.component.html",
})
export class CircleDetailComponent {
  ui = inject(UiService)
  auth = inject(AuthService)
  catalog = inject(CatalogService)
  circleService = inject(CircleService)
  store = inject(DatabaseStore)
  id = input<string>()
  confirming = signal(false)
  circle = computed(() => this.circleService.circles().find((c) => c.id === Number(this.id())))
  book = computed(() => this.catalog.books().find((b) => b.id === this.circle()?.bookId))
  enrollment = computed(() => {
    const u = this.auth.user()
    return u
      ? this.store
          .db()
          .enrollments.find((e) => e.userId === u.id && e.circleId === this.circle()?.id && e.status !== "Cancelada")
      : undefined
  })
  state = computed(() => {
    const e = this.enrollment()
    return e ? (e.status === "Activa" ? "Confirmada" : "Pendiente") : "Disponible"
  })
  data = computed(() => {
    const c = this.circle()!
    return [
      ["Tema", c.topic],
      ["Día", c.day],
      ["Horario", c.time],
      ["Cupo máximo", `${c.capacity} personas`],
      ["Inicio", fmt(c.start)],
      ["Finalización", fmt(c.end)],
    ]
  })
  pct(a: number, b: number) {
    return Math.min((a / b) * 100, 100)
  }
  start() {
    if (this.auth.gate(this.ui.path())) this.confirming.set(true)
  }
  register() {
    const result = this.circleService.enroll(this.circle()!.id)
    this.confirming.set(false)
    if (!result.ok) return this.ui.notify(result.message || "No se pudo inscribir", "error")
    this.ui.notify("Inscripción enviada. La biblioteca confirmará tu lugar")
  }
  async cancel() {
    const e = this.enrollment()
    if (!e) return
    if (
      await this.ui.ask({
        title: "Cancelar inscripción",
        message: `Liberarás tu lugar en "${this.circle()!.name}".`,
        confirmLabel: "Cancelar inscripción",
        tone: "danger",
      })
    ) {
      this.circleService.setEnrollment(e.id, "Cancelada")
      this.ui.notify("Inscripción cancelada")
    }
  }
}
