import { Routes } from "@angular/router"
import { adminGuard, authGuard, readerGuard } from "@core/guards"
import { AUTH_ROUTES } from "@features/auth/auth.routes"
import { PublicLayoutComponent } from "@layouts/public-layout/public-layout.component"

export const routes: Routes = [
  // Autenticación (sin header público)
  ...AUTH_ROUTES,

  // Área administrativa (carga diferida)
  {
    path: "admin",
    canActivate: [adminGuard],
    loadChildren: () => import("@features/admin/admin.routes").then((m) => m.ADMIN_ROUTES),
  },

  // Área pública y del lector
  {
    path: "",
    component: PublicLayoutComponent,
    children: [
      { path: "", loadComponent: () => import("@features/home/home.component").then((m) => m.HomeComponent) },
      {
        path: "catalogo",
        loadComponent: () => import("@features/catalog/catalog/catalog.component").then((m) => m.CatalogComponent),
      },
      {
        path: "libros/:id",
        loadComponent: () =>
          import("@features/catalog/book-detail/book-detail.component").then((m) => m.BookDetailComponent),
      },
      {
        path: "autores/:id",
        loadComponent: () => import("@features/catalog/author/author.component").then((m) => m.AuthorComponent),
      },
      {
        path: "circulos",
        loadComponent: () => import("@features/circles/circles/circles.component").then((m) => m.CirclesComponent),
      },
      {
        path: "circulos/:id",
        loadComponent: () =>
          import("@features/circles/circle-detail/circle-detail.component").then((m) => m.CircleDetailComponent),
      },
      {
        path: "prestamos",
        canActivate: [authGuard],
        loadComponent: () => import("@features/account/loans/loans.component").then((m) => m.LoansComponent),
      },
      {
        path: "solicitudes",
        canActivate: [authGuard],
        loadComponent: () => import("@features/account/requests/requests.component").then((m) => m.RequestsComponent),
      },
      {
        path: "favoritos",
        canActivate: [authGuard],
        loadComponent: () =>
          import("@features/account/favorites/favorites.component").then((m) => m.FavoritesComponent),
      },
      {
        path: "mis-circulos",
        canActivate: [authGuard],
        loadComponent: () =>
          import("@features/circles/my-circles/my-circles.component").then((m) => m.MyCirclesComponent),
      },
      {
        path: "perfil",
        canActivate: [readerGuard],
        loadComponent: () => import("@features/account/profile/profile.component").then((m) => m.ProfileComponent),
      },
      {
        path: "**",
        loadComponent: () =>
          import("@shared/components/not-found/not-found.component").then((m) => m.NotFoundComponent),
      },
    ],
  },
]
