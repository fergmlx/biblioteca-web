import { Injectable, computed, inject } from "@angular/core"
import type { Circle, CircleView, Enrollment, Result } from "../models"
import { iso } from "../utils/date.utils"
import { AuthService } from "./auth.service"
import { DatabaseStore, nextId } from "./database.store"

/** Círculos de lectura e inscripciones. */
@Injectable({ providedIn: "root" })
export class CircleService {
  private store = inject(DatabaseStore)
  private auth = inject(AuthService)

  readonly circles = computed<CircleView[]>(() => {
    const d = this.store.db()
    return d.circles.map((circle) => {
      const enrolled =
        circle.enrolledBase + d.enrollments.filter((e) => e.circleId === circle.id && e.status !== "Cancelada").length
      return { ...circle, enrolled, seatsLeft: Math.max(circle.capacity - enrolled, 0) }
    })
  })

  enroll(circleId: number): Result {
    const u = this.auth.user()
    const d = this.store.db()
    if (!u) return { ok: false, message: "Inicia sesión para inscribirte" }
    const circle = this.circles().find((c) => c.id === circleId)
    if (!circle || circle.seatsLeft <= 0) return { ok: false, message: "Este círculo ya no tiene lugares" }
    if (d.enrollments.some((e) => e.userId === u.id && e.circleId === circleId && e.status !== "Cancelada"))
      return { ok: false, message: "Ya estás inscrito en este círculo" }
    const enrollment: Enrollment = {
      id: nextId(d.enrollments),
      userId: u.id,
      circleId,
      date: iso(),
      status: "Pendiente",
    }
    this.store.update((x) => ({ ...x, enrollments: [...x.enrollments, enrollment] }))
    return { ok: true }
  }

  setEnrollment(id: number, status: Enrollment["status"]) {
    this.store.update((d) => ({ ...d, enrollments: d.enrollments.map((e) => (e.id === id ? { ...e, status } : e)) }))
  }

  saveCircle(circle: Omit<Circle, "id"> & { id?: number }): number {
    const id = circle.id ?? nextId(this.store.db().circles)
    this.store.update((d) => ({
      ...d,
      circles: circle.id
        ? d.circles.map((c) => (c.id === id ? { ...c, ...circle, id } : c))
        : [...d.circles, { ...circle, id }],
    }))
    return id
  }

  toggleCircle(id: number) {
    this.store.update((d) => ({ ...d, circles: d.circles.map((c) => (c.id === id ? { ...c, active: !c.active } : c)) }))
  }
}
