import { Injectable, computed, inject, signal } from "@angular/core"
import { NavigationEnd, Router } from "@angular/router"
import type { AskOptions, Toast } from "../models"

/** Navegación, notificaciones (toasts) y diálogos de confirmación. */
@Injectable({ providedIn: "root" })
export class UiService {
  private router = inject(Router)
  private toastId = 0

  readonly toasts = signal<Toast[]>([])
  readonly dialog = signal<(AskOptions & { resolve: (ok: boolean) => void }) | null>(null)

  /** URL actual (ruta + query) sincronizada con el Router de Angular. */
  readonly url = signal(window.location.pathname + window.location.search)
  readonly path = computed(() => this.url().split("?")[0].replace(/\/+$/, "") || "/")
  readonly query = computed(() => new URLSearchParams(this.url().split("?")[1] || ""))

  constructor() {
    this.router.events.subscribe((e) => {
      if (e instanceof NavigationEnd) this.url.set(e.urlAfterRedirects)
    })
  }

  navigate(url: string) {
    this.router.navigateByUrl(url).then(() => window.scrollTo({ top: 0, behavior: "smooth" }))
  }

  notify(message: string, type: "success" | "error" = "success") {
    const id = ++this.toastId
    this.toasts.update((c) => [...c, { id, message, type }])
    window.setTimeout(() => this.toasts.update((c) => c.filter((t) => t.id !== id)), 3400)
  }

  ask(options: AskOptions) {
    return new Promise<boolean>((resolve) => this.dialog.set({ ...options, resolve }))
  }

  closeDialog(ok: boolean) {
    this.dialog()?.resolve(ok)
    this.dialog.set(null)
  }
}
