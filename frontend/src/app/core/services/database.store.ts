import { Injectable, effect, signal } from "@angular/core"
import type { Database } from "../models"
import { buildSeed } from "../seed/seed.data"
import { iso } from "../utils/date.utils"

const STORAGE_KEY = "biblioteca-db-v4"

function loadDb(): Database {
  try {
    const raw = localStorage.getItem(STORAGE_KEY)
    if (raw) return JSON.parse(raw) as Database
  } catch {
    /* datos corruptos: se usa la semilla */
  }
  return buildSeed()
}

/** Siguiente id incremental para una colección. */
export function nextId(items: { id: number }[]) {
  return items.reduce((max, item) => Math.max(max, item.id), 0) + 1
}

/**
 * Capa de persistencia: única fuente de verdad del estado (localStorage).
 * Al integrar el backend Java, los servicios de dominio sustituyen las
 * mutaciones de `update()` por llamadas HTTP y esta clase queda como caché.
 */
@Injectable({ providedIn: "root" })
export class DatabaseStore {
  readonly db = signal<Database>(loadDb())
  readonly today = iso()

  constructor() {
    effect(() => localStorage.setItem(STORAGE_KEY, JSON.stringify(this.db())))
  }

  update(fn: (current: Database) => Database) {
    this.db.update(fn)
  }

  reset() {
    this.db.set(buildSeed())
  }
}
