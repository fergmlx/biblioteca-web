import { ButtonComponent } from "@shared/components/button/button.component"
import { BookCoverComponent } from "@shared/components/book-cover/book-cover.component"
import { EmptyStateComponent } from "@shared/components/empty-state/empty-state.component"
import { FieldComponent } from "@shared/components/field/field.component"
import { ModalComponent } from "@shared/components/modal/modal.component"
import { SelectComponent } from "@shared/components/select/select.component"
import { StatusComponent } from "@shared/components/status/status.component"
import { ActionsComponent } from "@features/admin/shared/components/actions/actions.component"
import { DataCardComponent } from "@features/admin/shared/components/data-card/data-card.component"
import { TableToolbarComponent } from "@features/admin/shared/components/table-toolbar/table-toolbar.component"
import { Component, computed, inject, signal } from "@angular/core"
import { CatalogService, DatabaseStore, UiService } from "@core/services"
import type { Copy } from "@core/models"

@Component({
  selector: "app-copies-admin",
  imports: [ButtonComponent, BookCoverComponent, EmptyStateComponent, FieldComponent, ModalComponent, SelectComponent, StatusComponent, ActionsComponent, DataCardComponent, TableToolbarComponent],
  templateUrl: "./copies-admin.component.html",
})
export class CopiesAdminComponent {
  ui = inject(UiService)
  catalog = inject(CatalogService)
  store = inject(DatabaseStore)
  conditions = ["Bueno", "Regular", "Dañado"]
  editing = signal<Partial<Copy> | null>(null)
  code = signal("")
  location = signal("")
  condition = signal("Bueno")
  book = computed(() => {
    const from = Number(this.ui.query().get("libro"))
    const books = this.store.db().books
    return books.find((b) => b.id === from) || books[0] || null
  })
  view = computed(() => this.catalog.books().find((b) => b.id === this.book()?.id))
  items = computed(() => this.catalog.copies().filter((c) => c.bookId === this.book()?.id))
  bookOptions = computed(() => this.store.db().books.map((b) => ({ value: String(b.id), label: b.title })))

  /** Abre el modal cargando los datos del ejemplar (o vacíos si es nuevo). */
  open(e: Partial<Copy>) {
    this.code.set(e.code ?? "")
    this.location.set(e.location ?? "")
    this.condition.set(e.condition ?? "Bueno")
    this.editing.set(e)
  }

  async remove(copy: { status: string; code: string; bookId: number; number: number }) {
    if (copy.status === "Prestado") return this.ui.notify("No puedes eliminar un ejemplar que está prestado", "error")
    const ok = await this.ui.ask({
      title: "Eliminar ejemplar",
      message: `Se eliminará el ejemplar ${copy.code} de forma permanente.`,
      confirmLabel: "Eliminar",
      tone: "danger",
    })
    if (!ok) return
    this.catalog.removeCopy(copy.bookId, copy.number)
    this.ui.notify("Ejemplar eliminado")
  }
  save() {
    const e = this.editing()!
    if (!this.code().trim() || !this.location().trim()) return this.ui.notify("Completa código y ubicación", "error")
    this.catalog.saveCopy({
      bookId: e.bookId!,
      number: e.number,
      code: this.code().trim(),
      location: this.location().trim(),
      condition: this.condition() as Copy["condition"],
    })
    this.ui.notify(e.number ? "Ejemplar actualizado" : "Ejemplar registrado")
    this.editing.set(null)
  }
}
