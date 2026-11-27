import { Routes } from "@angular/router"
import { AdminLayoutComponent } from "@layouts/admin-layout/admin-layout.component"

/** Rutas bajo /admin (protegidas por adminGuard en app.routes.ts). */
export const ADMIN_ROUTES: Routes = [
  {
    path: "",
    component: AdminLayoutComponent,
    children: [
      { path: "", loadComponent: () => import("./dashboard/dashboard.component").then((m) => m.DashboardComponent) },
      {
        path: "perfil",
        loadComponent: () =>
          import("./profile/admin-profile/admin-profile.component").then((m) => m.AdminProfileComponent),
      },
      {
        path: "ejemplares",
        loadComponent: () => import("./copies/copies-admin/copies-admin.component").then((m) => m.CopiesAdminComponent),
      },
      {
        path: "libros",
        loadComponent: () => import("./books/books-admin/books-admin.component").then((m) => m.BooksAdminComponent),
      },
      {
        path: "libros/nuevo",
        loadComponent: () => import("./books/book-form/book-form.component").then((m) => m.BookFormComponent),
      },
      {
        path: "libros/:id/editar",
        loadComponent: () => import("./books/book-form/book-form.component").then((m) => m.BookFormComponent),
      },
      {
        path: "autores",
        loadComponent: () =>
          import("./authors/authors-admin/authors-admin.component").then((m) => m.AuthorsAdminComponent),
      },
      {
        path: "autores/nuevo",
        loadComponent: () => import("./authors/author-form/author-form.component").then((m) => m.AuthorFormComponent),
      },
      {
        path: "autores/:id/editar",
        loadComponent: () => import("./authors/author-form/author-form.component").then((m) => m.AuthorFormComponent),
      },
      {
        path: "usuarios",
        loadComponent: () => import("./users/users-admin/users-admin.component").then((m) => m.UsersAdminComponent),
      },
      {
        path: "usuarios/nuevo",
        loadComponent: () => import("./users/user-form/user-form.component").then((m) => m.UserFormComponent),
      },
      {
        path: "usuarios/:id/editar",
        loadComponent: () => import("./users/user-form/user-form.component").then((m) => m.UserFormComponent),
      },
      {
        path: "usuarios/:id",
        loadComponent: () => import("./users/user-detail/user-detail.component").then((m) => m.UserDetailComponent),
      },
      {
        path: "solicitudes",
        loadComponent: () =>
          import("./requests/requests-admin/requests-admin.component").then((m) => m.RequestsAdminComponent),
      },
      {
        path: "prestamos",
        loadComponent: () => import("./loans/loans-admin/loans-admin.component").then((m) => m.LoansAdminComponent),
      },
      {
        path: "prestamos/nuevo",
        loadComponent: () => import("./loans/loan-form/loan-form.component").then((m) => m.LoanFormComponent),
      },
      {
        path: "circulos",
        loadComponent: () =>
          import("./circles/circles-admin/circles-admin.component").then((m) => m.CirclesAdminComponent),
      },
      {
        path: "circulos/nuevo",
        loadComponent: () => import("./circles/circle-form/circle-form.component").then((m) => m.CircleFormComponent),
      },
      {
        path: "circulos/:id/editar",
        loadComponent: () => import("./circles/circle-form/circle-form.component").then((m) => m.CircleFormComponent),
      },
      {
        path: "circulos/:id",
        loadComponent: () =>
          import("./circles/circle-detail-admin/circle-detail-admin.component").then(
            (m) => m.CircleDetailAdminComponent,
          ),
      },
      {
        path: "inscripciones",
        loadComponent: () =>
          import("./enrollments/enrollments-admin/enrollments-admin.component").then(
            (m) => m.EnrollmentsAdminComponent,
          ),
      },
      {
        path: "generos",
        loadComponent: () => import("./genres/genres-admin/genres-admin.component").then((m) => m.GenresAdminComponent),
      },
      {
        path: "resenas",
        loadComponent: () =>
          import("./reviews/reviews-admin/reviews-admin.component").then((m) => m.ReviewsAdminComponent),
      },
      { path: "reportes", loadComponent: () => import("./reports/reports.component").then((m) => m.ReportsComponent) },
      { path: "libros/:id/ejemplares", redirectTo: "ejemplares" },
      {
        path: "**",
        loadComponent: () =>
          import("@shared/components/not-found/not-found.component").then((m) => m.NotFoundComponent),
      },
    ],
  },
]
