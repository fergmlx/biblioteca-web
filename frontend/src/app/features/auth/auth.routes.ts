import { Routes } from "@angular/router"
import { guestGuard } from "@core/guards"

/** Rutas de autenticación (sin cabecera pública). */
export const AUTH_ROUTES: Routes = [
  {
    path: "login",
    canActivate: [guestGuard],
    data: { mode: "login" },
    loadComponent: () => import("./auth/auth.component").then((m) => m.AuthComponent),
  },
  {
    path: "registro",
    canActivate: [guestGuard],
    data: { mode: "register" },
    loadComponent: () => import("./auth/auth.component").then((m) => m.AuthComponent),
  },
  {
    path: "recuperar",
    loadComponent: () => import("./forgot-password/forgot-password.component").then((m) => m.ForgotPasswordComponent),
  },
  {
    path: "recuperar/restablecer",
    loadComponent: () => import("./reset-password/reset-password.component").then((m) => m.ResetPasswordComponent),
  },
]
