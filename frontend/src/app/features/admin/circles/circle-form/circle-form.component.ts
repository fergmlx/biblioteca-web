import { ButtonComponent } from "@shared/components/button/button.component"
import { FieldComponent } from "@shared/components/field/field.component"
import { PageHeaderComponent } from "@shared/components/page-header/page-header.component"
import { SelectComponent } from "@shared/components/select/select.component"
import { TextAreaComponent } from "@shared/components/text-area/text-area.component"
import { AdminNotFoundComponent } from "@features/admin/shared/components/admin-not-found/admin-not-found.component"
import { CrumbsComponent } from "@features/admin/shared/components/crumbs/crumbs.component"
import { Component, OnInit, computed, inject, input, signal } from "@angular/core"
import { CircleService, DatabaseStore, UiService } from "@core/services"
import { weekdays } from "@core/constants"
import { iso } from "@core/utils"

@Component({
  selector: "app-circle-form",
  imports: [ButtonComponent, FieldComponent, PageHeaderComponent, SelectComponent, TextAreaComponent, AdminNotFoundComponent, CrumbsComponent],
  templateUrl: "./circle-form.component.html",
})
export class CircleFormComponent implements OnInit {
  ui = inject(UiService)
  circleService = inject(CircleService)
  store = inject(DatabaseStore)
  id = input<string>()
  weekdays = weekdays
  circle = computed(() => this.store.db().circles.find((c) => c.id === Number(this.id())) ?? null)
  missing = computed(() => !!this.id() && !this.circle())
  f = signal({
    name: "",
    description: "",
    topic: "",
    bookId: "",
    day: weekdays[5],
    time: "10:00",
    capacity: "15",
    start: iso(),
    end: iso(60),
  })
  bookOptions = computed(() => [
    { value: "", label: "Sin libro asociado" },
    ...this.store.db().books.map((b) => ({ value: String(b.id), label: b.title })),
  ])
  ngOnInit() {
    const c = this.circle()
    if (c)
      this.f.set({
        name: c.name,
        description: c.description,
        topic: c.topic,
        bookId: c.bookId ? String(c.bookId) : "",
        day: c.day,
        time: c.time,
        capacity: String(c.capacity),
        start: c.start,
        end: c.end,
      })
  }
  set(key: string, value: string) {
    this.f.update((c) => ({ ...c, [key]: value }))
  }
  submit(event: Event) {
    event.preventDefault()
    const f = this.f(),
      circle = this.circle()
    if (!f.name.trim()) return this.ui.notify("El nombre es obligatorio", "error")
    if (!f.bookId && !f.topic.trim()) return this.ui.notify("Indica un tema o selecciona un libro asociado", "error")
    if (Number(f.capacity) < 1) return this.ui.notify("El cupo debe ser al menos 1", "error")
    const book = this.store.db().books.find((b) => String(b.id) === f.bookId)
    this.circleService.saveCircle({
      id: circle?.id,
      name: f.name.trim(),
      description: f.description.trim(),
      topic: f.topic.trim() || book?.title || "",
      bookId: book ? book.id : null,
      day: f.day,
      time: f.time,
      capacity: Number(f.capacity),
      enrolledBase: circle?.enrolledBase ?? 0,
      start: f.start,
      end: f.end,
      active: circle?.active ?? true,
    })
    this.ui.notify(circle ? "Círculo actualizado" : "Círculo creado correctamente")
    this.ui.navigate("/admin/circulos")
  }
}
