import { ButtonComponent } from "@shared/components/button/button.component"
import { FieldComponent } from "@shared/components/field/field.component"
import { IconComponent } from "@shared/components/icon/icon.component"
import { PageHeaderComponent } from "@shared/components/page-header/page-header.component"
import { SelectComponent } from "@shared/components/select/select.component"
import { TextAreaComponent } from "@shared/components/text-area/text-area.component"
import { AdminNotFoundComponent } from "@features/admin/shared/components/admin-not-found/admin-not-found.component"
import { CrumbsComponent } from "@features/admin/shared/components/crumbs/crumbs.component"
import { Component, OnInit, computed, inject, input, signal } from "@angular/core"
import { CatalogService, DatabaseStore, UiService } from "@core/services"
import { countries } from "@core/constants"

@Component({
  selector: "app-author-form",
  imports: [ButtonComponent, FieldComponent, IconComponent, PageHeaderComponent, SelectComponent, TextAreaComponent, AdminNotFoundComponent, CrumbsComponent],
  templateUrl: "./author-form.component.html",
})
export class AuthorFormComponent implements OnInit {
  ui = inject(UiService)
  catalog = inject(CatalogService)
  store = inject(DatabaseStore)
  id = input<string>()
  countries = countries
  author = computed(() => this.store.db().authors.find((a) => a.id === Number(this.id())) ?? null)
  missing = computed(() => !!this.id() && !this.author())
  f = signal({ name: "", last: "", maternal: "", country: countries[0], birth: "", death: "", bio: "" })
  image = signal("")
  ngOnInit() {
    const a = this.author()
    if (a)
      this.f.set({
        name: a.name,
        last: a.last,
        maternal: a.maternal,
        country: a.country,
        birth: a.birth,
        death: a.death,
        bio: a.bio,
      })
  }
  set(key: string, value: string) {
    this.f.update((c) => ({ ...c, [key]: value }))
  }
  pickFile(event: Event) {
    const file = (event.target as HTMLInputElement).files?.[0]
    if (file) this.image.set(URL.createObjectURL(file))
  }
  submit(event: Event) {
    event.preventDefault()
    const f = this.f(),
      author = this.author()
    if (!f.name.trim() || !f.last.trim()) return this.ui.notify("Nombres y apellido paterno son obligatorios", "error")
    this.catalog.saveAuthor({ id: author?.id, ...f, active: author?.active ?? true })
    this.ui.notify(author ? "Autor actualizado" : "Autor creado correctamente")
    this.ui.navigate("/admin/autores")
  }
}
