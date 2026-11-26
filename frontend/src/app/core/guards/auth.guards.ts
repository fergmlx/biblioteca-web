import { inject } from "@angular/core"
import { CanActivateFn, Router } from "@angular/router"
import { AuthService } from "../services/auth.service"

const loginUrl = (router: Router, next: string) => router.parseUrl(`/login?next=${encodeURIComponent(next)}`)

/** Solo para sesiones iniciadas (lector o admin). */
export const authGuard: CanActivateFn = (_route, state) => {
  const router = inject(Router)
  return inject(AuthService).role() === "guest" ? loginUrl(router, state.url) : true
}

/** /login y /registro: si ya hay sesión, redirige según el rol. */
export const guestGuard: CanActivateFn = () => {
  const router = inject(Router)
  const role = inject(AuthService).role()
  return role === "guest" ? true : router.parseUrl(role === "admin" ? "/admin" : "/perfil")
}

/** Área /admin: invitados van a login, lectores a su perfil. */
export const adminGuard: CanActivateFn = (_route, state) => {
  const router = inject(Router)
  const role = inject(AuthService).role()
  if (role === "admin") return true
  return role === "guest" ? loginUrl(router, state.url) : router.parseUrl("/perfil")
}

/** /perfil del lector: el admin usa /admin/perfil. */
export const readerGuard: CanActivateFn = (_route, state) => {
  const router = inject(Router)
  const role = inject(AuthService).role()
  if (role === "admin") return router.parseUrl("/admin/perfil")
  return role === "guest" ? loginUrl(router, state.url) : true
}
