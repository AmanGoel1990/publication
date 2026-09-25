import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { LoginResponse } from '../models/login-response';
import { LoginRequest } from '../models/login-request';
import { Observable, map } from 'rxjs';

const LOGIN_API_URL = 'http://localhost:8080/api/login';
const REGISTER_API_URL = 'http://localhost:8080/api/register';
const BOOKS_API_URL = 'http://localhost:8080/api/books';

type ApiBook = {
  id?: number | string;
  title?: string;
  price?: string | number;
  image?: string;
  description?: string;
  type?: 'new' | 'old';
  accent?: string;
};

@Injectable({
  providedIn: 'root',
})
export class Integration {
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
    fullName: string;
    username: string;
    email: string;
    phone: string;
    password: string;
  }): Observable<{ message?: string }> {
    return this.http.post<{ message?: string }>(REGISTER_API_URL, request, { observe: 'response' }).pipe(
      map((response) => {
        if (response.status !== 200) {
          throw new Error('Registration failed');
        }

        return response.body ?? { message: 'Registration successful' };
      }),
    );
  }

  getBooks(): Observable<ApiBook[]> {
    return this.http.get<ApiBook[]>(BOOKS_API_URL).pipe(
      map((response) => this.normalizeBooks(response)),
    );
  }

  addBook(book: ApiBook): Observable<ApiBook> {
    return this.http.post<ApiBook>(BOOKS_API_URL, this.normalizeBookPayload(book)).pipe(
      map((response) => this.normalizeBook(response)),
    );
  }

  updateBook(id: number | string, book: ApiBook): Observable<ApiBook> {
    return this.http.put<ApiBook>(`${BOOKS_API_URL}/${id}`, this.normalizeBookPayload(book)).pipe(
      map((response) => this.normalizeBook(response)),
    );
  }

  deleteBook(id: number | string): Observable<void> {
    return this.http.delete<void>(`${BOOKS_API_URL}/${id}`);
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

  private normalizeBook(book: Partial<ApiBook> | null | undefined): ApiBook {
    if (!book) {
      return {
        title: '',
        price: '',
        image: '',
        description: '',
        type: 'new',
        accent: '#2f4858',
      };
    }

    return {
      id: book.id,
      title: book.title ?? 'Untitled Book',
      price: book.price ?? '',
      image:
        book.image || 'https://placehold.co/600x400/eeeeee/222222?text=Book+Cover',
      description: book.description ?? 'No description provided yet.',
      type: book.type ?? 'new',
      accent: book.accent ?? '#2f4858',
    };
  }

  private normalizeBookPayload(book: Partial<ApiBook>): ApiBook {
    return {
      id: book.id,
      title: book.title ?? '',
      price: book.price ?? '',
      image: book.image ?? '',
      description: book.description ?? '',
      type: book.type ?? 'new',
      accent: book.accent ?? '#2f4858',
    };
  }
}
