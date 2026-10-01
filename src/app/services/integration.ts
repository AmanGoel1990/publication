import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { LoginResponse } from '../models/login-response';
import { LoginRequest } from '../models/login-request';
import { Observable, map, shareReplay, tap } from 'rxjs';

const LOGIN_API_URL = 'http://localhost:8080/api/login';
const REGISTER_API_URL = 'http://localhost:8080/api/register';
const BOOKS_API_URL = 'http://localhost:8080/api/books';
const BOOK_IMAGE_UPLOAD_URL = '/public/books';

type ApiBook = {
  id?: number | string;
  title?: string;
  author?: string;
  price?: string | number;
  hardcopyprice?: string | number;
  ebookprice?: string | number;
  hardcopyPrice?: string | number;
  ebookPrice?: string | number;
  image?: string;
  pdf?: string;
  pdfFileName?: string;
  description?: string;
  type?: 'new' | 'old';
  accent?: string;
};

@Injectable({
  providedIn: 'root',
})
export class Integration {
  private booksCache$: Observable<ApiBook[]> | null = null;

  constructor(private http: HttpClient) {}

  doLogin(request: LoginRequest): Observable<LoginResponse> {
    const params = new HttpParams()
      .set('username', request.username ?? '')
      .set('password', request.password ?? '');

    return this.http.get<LoginResponse>(LOGIN_API_URL, { params, observe: 'response' }).pipe(
      map((response) => {
        if (response.status !== 200) {
          throw new Error('Login failed');
        }

        return response.body ?? {};
      }),
    );
  }

  doRegister(request: {
    name: string;
    username: string;
    email: string;
    phone: string;
    password: string;
  }): Observable<{ message?: string }> {
    return this.http.post<{ message?: string }>(REGISTER_API_URL, request, { observe: 'response' }).pipe(
      map((response) => {
        if (response.status < 200 || response.status >= 300) {
          throw new Error('Registration failed');
        }

        return response.body ?? {};
      }),
    );
  }

  getBooks(): Observable<ApiBook[]> {
    if (!this.booksCache$) {
      this.booksCache$ = this.http.get<ApiBook[]>(BOOKS_API_URL).pipe(
        map((response) => this.normalizeBooks(response)),
        shareReplay({ bufferSize: 1, refCount: false }),
      );
    }

    return this.booksCache$;
  }

  addBook(book: ApiBook): Observable<ApiBook> {
    return this.http.post<ApiBook>(BOOKS_API_URL, this.toApiBookPayload(book)).pipe(
      map((response) => this.normalizeBook(this.mergeBookResponse(book, response))),
      tap(() => (this.booksCache$ = null)),
    );
  }

  uploadBookPdf(file: File): Observable<{ pdfUrl: string }> {
    const body = new FormData();
    body.append('book', file);

    return this.http.post<{ pdfUrl: string }>(BOOK_IMAGE_UPLOAD_URL, body);
  }

  updateBook(id: number | string, book: ApiBook): Observable<ApiBook> {
    return this.http.put<ApiBook>(`${BOOKS_API_URL}/${id}`, this.toApiBookPayload(book)).pipe(
      map((response) => this.normalizeBook(this.mergeBookResponse(book, response))),
      tap(() => (this.booksCache$ = null)),
    );
  }

  deleteBook(id: number | string): Observable<void> {
    return this.http.delete<void>(`${BOOKS_API_URL}/${id}`).pipe(
      tap(() => (this.booksCache$ = null)),
    );
  }

  private normalizeBooks(books: ApiBook[] | { data?: ApiBook[] } | null): ApiBook[] {
    if (!books) {
      return [];
    }

    if (Array.isArray(books)) {
      return books.map((book) => this.normalizeBook(book));
    }

    return (books.data ?? []).map((book) => this.normalizeBook(book));
  }

  private mergeBookResponse(submittedBook: ApiBook, response: ApiBook | null): ApiBook {
    const mergedBook = { ...submittedBook };
    if (!response) {
      return mergedBook;
    }

    for (const key of Object.keys(response) as (keyof ApiBook)[]) {
      const value = response[key];
      if (value !== undefined && value !== null) {
        Object.assign(mergedBook, { [key]: value });
      }
    }

    return mergedBook;
  }

  private normalizeBook(book: Partial<ApiBook> | null | undefined): ApiBook {
    if (!book) {
      return {
        id: '',
        title: '',
        price: '',
        image: '',
        pdf: '',
        description: '',
        type: 'new',
        accent: '#2f4858',
      };
    }

    return {
      id: book.id ?? '',
      title: book.title ?? 'Untitled Book',
      author: book.author ?? '',
      price: book.price ?? '',
      hardcopyprice: book.hardcopyprice ?? book.hardcopyPrice ?? book.price ?? '',
      ebookprice: book.ebookprice ?? book.ebookPrice ?? '',
      image:
        book.image || 'https://placehold.co/600x400/eeeeee/222222?text=Book+Cover',
      pdf: book.pdf ?? (book.pdfFileName ? `/books/${book.pdfFileName}` : ''),
      pdfFileName: book.pdfFileName ?? this.getPdfFileName(book.pdf),
      description: book.description ?? 'No description provided yet.',
      type: book.type ?? 'new',
      accent: book.accent ?? '#2f4858',
    };
  }

  private toApiBookPayload(book: Partial<ApiBook>): {
    id: number | string;
    title: string;
    author: string;
    description: string;
    type: 'new' | 'old';
    price: number;
    hardcopyprice: number;
    ebookprice: number;
    pdfFileName: string;
  } {
    const hardcopyPrice = Number(book.hardcopyprice ?? book.hardcopyPrice ?? book.price ?? 0);
    return {
      id: book.id ?? '',
      title: book.title ?? '',
      author: book.author ?? '',
      description: book.description ?? '',
      type: book.type ?? 'new',
      price: hardcopyPrice,
      hardcopyprice: hardcopyPrice,
      ebookprice: Number(book.ebookprice ?? book.ebookPrice ?? 0),
      pdfFileName: book.pdfFileName ?? this.getPdfFileName(book.pdf),
    };
  }

  private getPdfFileName(pdf?: string): string {
    return pdf?.split('/').pop() ?? '';
  }
}
