import { ICON_PATHS, type IconName } from "./icons"
import { Component, computed, inject, input } from "@angular/core"
import { DomSanitizer } from "@angular/platform-browser"

@Component({
  selector: "app-icon",
  host: { style: "display: contents" },
  templateUrl: "./icon.component.html",
})
export class IconComponent {
  name = input.required<IconName>()
  size = input(20)
  private sanitizer = inject(DomSanitizer)
  markup = computed(() => this.sanitizer.bypassSecurityTrustHtml(ICON_PATHS[this.name()]))
}
