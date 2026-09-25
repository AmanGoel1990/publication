import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Integration } from '../services/integration';

type DashboardBook = {
  id?: number | string;
  title: string;
  price: string;
  image: string;
  description: string;
  accent: string;
  type: 'new' | 'old';
};

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './dashboard.html',
  styleUrl: './dashboard.css',
})
export class Dashboard implements OnInit {
  books: DashboardBook[] = [];

  editingIndex: number | null = null;
  editingId: number | string | null = null;

  form: DashboardBook = {
    title: '',
    price: '',
    image: '',
    description: '',
    accent: '#2f4858',
    type: 'new',
  };

  constructor(private integration: Integration) {}

  ngOnInit(): void {
    this.loadBooks();
  }

  loadBooks(): void {
    this.integration.getBooks().subscribe({
      next: (books) => {
        this.books = books.map((book) => this.mapBook(book));
      },
      error: () => {
        this.books = [];
      },
    });
  }

  submitBook(): void {
    const title = this.form.title.trim();
    const price = this.form.price.trim();
    const description = this.form.description.trim();

    if (!title || !price) {
      return;
    }

    const book: DashboardBook = {
      id: this.editingId ?? undefined,
      title,
      price,
      image: this.form.image.trim() || 'https://placehold.co/600x400/eeeeee/222222?text=Book+Cover',
      description: description || 'No description provided yet.',
      accent: this.form.accent || '#2f4858',
      type: this.form.type || 'new',
    };

    if (this.editingIndex !== null && this.editingId !== null) {
      this.integration.updateBook(this.editingId, book).subscribe({
        next: (updatedBook) => {
          this.books[this.editingIndex as number] = this.mapBook(updatedBook);
          this.resetForm();
        },
        error: () => {
          this.resetForm();
        },
      });
      return;
    }

    this.integration.addBook(book).subscribe({
      next: (createdBook) => {
        this.books.unshift(this.mapBook(createdBook));
        this.resetForm();
      },
      error: () => {
        this.books.unshift({ ...book, id: Date.now().toString() });
        this.resetForm();
      },
    });
  }

  editBook(index: number): void {
    const selected = this.books[index];
    this.form = { ...selected };
    this.editingIndex = index;
    this.editingId = selected.id ?? null;
  }

  deleteBook(index: number): void {
    const selected = this.books[index];
    const id = selected.id;

    if (id !== undefined && id !== null) {
      this.integration.deleteBook(id).subscribe({
        next: () => {
          this.books.splice(index, 1);
        },
        error: () => {
          this.books.splice(index, 1);
        },
      });
      return;
    }

    this.books.splice(index, 1);

    if (this.editingIndex === index) {
      this.resetForm();
    }
  }

  private mapBook(book: {
    id?: number | string;
    title?: string;
    price?: string | number;
    image?: string;
    description?: string;
    accent?: string;
    type?: 'new' | 'old';
  }): DashboardBook {
    return {
      id: book.id,
      title: book.title ?? 'Untitled Book',
      price: String(book.price ?? ''),
      image: book.image || 'https://placehold.co/600x400/eeeeee/222222?text=Book+Cover',
      description: book.description ?? 'No description provided yet.',
      accent: book.accent ?? '#2f4858',
      type: book.type === 'old' ? 'old' : 'new',
    };
  }

  resetForm(): void {
    this.form = {
      title: '',
      price: '',
      image: '',
      description: '',
      accent: '#2f4858',
      type: 'new',
    };
    this.editingIndex = null;
    this.editingId = null;
  }
}
