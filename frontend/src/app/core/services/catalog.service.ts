import { Injectable, computed, inject } from "@angular/core"
import type { Author, Book, BookView, Copy, CopyView, Review } from "../models"
import { iso } from "../utils/date.utils"
import { AuthService } from "./auth.service"
import { DatabaseStore, nextId } from "./database.store"

/** Libros, autores, géneros, ejemplares, reseñas y favoritos. */
@Injectable({ providedIn: "root" })
export class CatalogService {
  private store = inject(DatabaseStore)
  private auth = inject(AuthService)

  readonly copies = computed<CopyView[]>(() => {
    const d = this.store.db()
    return d.copies.map((copy) => {
      const lent = d.loans.some((l) => l.bookId === copy.bookId && l.copy === copy.number && !l.returned)
      return { ...copy, status: lent ? "Prestado" : copy.condition === "Dañado" ? "Mantenimiento" : "Disponible" }
    })
  })

  readonly books = computed<BookView[]>(() => {
    const d = this.store.db()
    const copies = this.copies()
    return d.books.map((book) => {
      const own = copies.filter((c) => c.bookId === book.id)
      const free = own.filter((c) => c.status === "Disponible").length
      const reviews = d.reviews.filter((r) => r.bookId === book.id)
      return {
        ...book,
        author: book.authorIds
          .map((id) => d.authors.find((a) => a.id === id))
          .filter((a): a is Author => Boolean(a))
          .map((a) => this.authorName(a))
          .join(", "),
        genre: book.genres.join(", "),
        available: free > 0,
        copiesTotal: own.length,
        copiesFree: free,
        rating: reviews.length ? reviews.reduce((s, r) => s + r.rating, 0) / reviews.length : 0,
        reviewCount: reviews.length,
      }
    })
  })

  readonly favorites = computed(() => {
    const u = this.auth.user()
    return u ? this.store.db().favorites[u.id] || [] : []
  })

  authorName(author: Author) {
    return `${author.name} ${author.last} ${author.maternal}`.trim()
  }

  freeCopies(bookId: number) {
    return this.copies().filter((c) => c.bookId === bookId && c.status === "Disponible")
  }

  // ---------- Lector ----------
  toggleFavorite(bookId: number) {
    const u = this.auth.user()
    if (!u) return false
    const current = this.store.db().favorites[u.id] || []
    const has = current.includes(bookId)
    this.store.update((d) => ({
      ...d,
      favorites: { ...d.favorites, [u.id]: has ? current.filter((id) => id !== bookId) : [...current, bookId] },
    }))
    return !has
  }

  addReview(bookId: number, rating: number, comment: string) {
    const u = this.auth.user()
    if (!u) return
    this.store.update((d) => ({
      ...d,
      reviews: [
        ...d.reviews.filter((r) => !(r.userId === u.id && r.bookId === bookId)),
        { id: nextId(d.reviews), userId: u.id, bookId, rating, comment, date: iso() } as Review,
      ],
    }))
  }

  deleteReview(id: number) {
    this.store.update((d) => ({ ...d, reviews: d.reviews.filter((r) => r.id !== id) }))
  }

  // ---------- Administración ----------
  saveBook(book: Omit<Book, "id"> & { id?: number }): number {
    const id = book.id ?? nextId(this.store.db().books)
    this.store.update((d) => ({
      ...d,
      books: book.id ? d.books.map((b) => (b.id === id ? { ...b, ...book, id } : b)) : [...d.books, { ...book, id }],
    }))
    return id
  }

  toggleBook(id: number) {
    this.store.update((d) => ({ ...d, books: d.books.map((b) => (b.id === id ? { ...b, active: !b.active } : b)) }))
  }

  saveAuthor(author: Omit<Author, "id"> & { id?: number }): number {
    const id = author.id ?? nextId(this.store.db().authors)
    this.store.update((d) => ({
      ...d,
      authors: author.id
        ? d.authors.map((a) => (a.id === id ? { ...a, ...author, id } : a))
        : [...d.authors, { ...author, id }],
    }))
    return id
  }

  toggleAuthor(id: number) {
    this.store.update((d) => ({ ...d, authors: d.authors.map((a) => (a.id === id ? { ...a, active: !a.active } : a)) }))
  }

  saveCopy(copy: Omit<Copy, "number"> & { number?: number }) {
    this.store.update((d) => {
      if (copy.number)
        return {
          ...d,
          copies: d.copies.map((c) =>
            c.bookId === copy.bookId && c.number === copy.number ? ({ ...c, ...copy } as Copy) : c,
          ),
        }
      const number = d.copies.filter((c) => c.bookId === copy.bookId).reduce((m, c) => Math.max(m, c.number), 0) + 1
      return { ...d, copies: [...d.copies, { ...copy, number }] }
    })
  }

  removeCopy(bookId: number, number: number) {
    this.store.update((d) => ({ ...d, copies: d.copies.filter((c) => !(c.bookId === bookId && c.number === number)) }))
  }

  saveGenre(name: string, id?: number) {
    this.store.update((d) => {
      const previous = id ? d.genres.find((g) => g.id === id)?.name : undefined
      return {
        ...d,
        genres: id
          ? d.genres.map((g) => (g.id === id ? { ...g, name } : g))
          : [...d.genres, { id: nextId(d.genres), name }],
        books:
          previous && previous !== name
            ? d.books.map((b) => ({ ...b, genres: b.genres.map((g) => (g === previous ? name : g)) }))
            : d.books,
      }
    })
  }

  deleteGenre(id: number) {
    this.store.update((d) => ({ ...d, genres: d.genres.filter((g) => g.id !== id) }))
  }
}
