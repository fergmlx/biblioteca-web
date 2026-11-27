import { Component } from "@angular/core"
import { RouterOutlet } from "@angular/router"
import { PublicFooterComponent } from "../public-footer/public-footer.component"
import { PublicHeaderComponent } from "../public-header/public-header.component"

/** Estructura de las páginas públicas y del lector: cabecera, contenido y pie. */
@Component({
  selector: "app-public-layout",
  imports: [RouterOutlet, PublicHeaderComponent, PublicFooterComponent],
  templateUrl: "./public-layout.component.html",
})
export class PublicLayoutComponent {}
