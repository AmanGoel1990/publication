import { CommonModule } from '@angular/common';
import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { HttpErrorResponse } from '@angular/common/http';
import { Integration } from '../services/integration';
import { PdfCover } from '../pdf-cover/pdf-cover';

type DashboardBook = {
  id?: number | string;
  title: string;
  author: string;
  hardcopyprice: string;
  ebookprice: string;
  image: string;
  pdf: string;
  description: string;
  accent: string;
  type: 'new' | 'old';
};

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [CommonModule, FormsModule, PdfCover],
  templateUrl: './dashboard.html',
  styleUrl: './dashboard.css',
})
export class Dashboard implements OnInit {
  @ViewChild('bookPdfInput') bookPdfInput?: ElementRef<HTMLInputElement>;

  books: DashboardBook[] = [];

  editingIndex: number | null = null;
  editingId: number | string | null = null;
  uploadingPdf = false;
  uploadError = '';
  pendingPdf: File | null = null;

  form: DashboardBook = {
    title: '',
    author: '',
    hardcopyprice: '',
    ebookprice: '',
    image: '',
    pdf: '',
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
    if (this.uploadingPdf) {
      return;
    }

    const title = this.form.title.trim();
    const hardcopyprice = String(this.form.hardcopyprice ?? '').trim();
    const ebookprice = String(this.form.ebookprice ?? '').trim();
    if (!title || !hardcopyprice || !ebookprice) {
      return;
    }

    this.uploadingPdf = true;
    this.uploadError = '';

    if (this.pendingPdf) {
      this.integration.uploadBookPdf(this.pendingPdf).subscribe({
        next: ({ pdfUrl }) => {
          this.form.pdf = pdfUrl;
          this.pendingPdf = null;
          this.saveBook();
        },
        error: (error: HttpErrorResponse) => {
          this.uploadError = error.error?.message ?? 'Upload failed. Check that the upload server is running.';
          this.uploadingPdf = false;
        },
      });
      return;
    }

    this.saveBook();
  }

  private saveBook(): void {
    const title = this.form.title.trim();
    const hardcopyprice = String(this.form.hardcopyprice ?? '').trim();
    const ebookprice = String(this.form.ebookprice ?? '').trim();
    const description = this.form.description.trim();

    if (!title || !hardcopyprice || !ebookprice) {
      return;
    }

    const book: DashboardBook = {
      id: this.editingId ?? undefined,
      title,
      author: this.form.author.trim(),
      hardcopyprice: hardcopyprice,
      ebookprice: ebookprice,
      image: this.form.image.trim() || 'https://placehold.co/600x400/eeeeee/222222?text=Book+Cover',
      pdf: this.form.pdf,
      description: description || 'No description provided yet.',
      accent: this.form.accent || '#2f4858',
      type: this.form.type || 'new',
    };

    if (this.editingIndex !== null && this.editingId !== null) {
      this.integration.updateBook(this.editingId, book).subscribe({
        next: (updatedBook) => {
          this.uploadingPdf = false;
          this.books[this.editingIndex as number] = this.mapBook(updatedBook);
          this.resetForm();
        },
        error: (error: HttpErrorResponse) => {
          this.uploadError = error.error?.message ?? 'Book could not be saved. Please try again.';
          this.uploadingPdf = false;
        },
      });
      return;
    }

    this.integration.addBook(book).subscribe({
      next: (createdBook) => {
        this.uploadingPdf = false;
        this.books.unshift(this.mapBook(createdBook));
        this.resetForm();
      },
      error: (error: HttpErrorResponse) => {
        this.uploadError = error.error?.message ?? 'Book could not be saved. Please try again.';
        this.uploadingPdf = false;
      },
    });
  }

  uploadPdf(event: Event): void {
    const input = event.target as HTMLInputElement;
    const file = input.files?.[0];

    if (!file) {
      return;
    }

    this.uploadError = '';
    this.pendingPdf = file;
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
    author?: string;
    price?: string | number;
    hardcopyprice?: string | number;
    ebookprice?: string | number;
    image?: string;
    pdf?: string;
    description?: string;
    accent?: string;
    type?: 'new' | 'old';
  }): DashboardBook {
    return {
      id: book.id,
      title: book.title ?? 'Untitled Book',
      author: book.author ?? '',
      hardcopyprice: String(book.hardcopyprice ?? book.price ?? ''),
      ebookprice: String(book.ebookprice ?? ''),
      image: book.image || 'https://placehold.co/600x400/eeeeee/222222?text=Book+Cover',
      pdf: book.pdf ?? '',
      description: book.description ?? 'No description provided yet.',
      accent: book.accent ?? '#2f4858',
      type: book.type === 'old' ? 'old' : 'new',
    };
  }

  resetForm(): void {
    this.uploadError = '';
    this.pendingPdf = null;
    this.uploadingPdf = false;
    if (this.bookPdfInput) {
      this.bookPdfInput.nativeElement.value = '';
    }
    this.form = {
      title: '',
      author: '',
      hardcopyprice: '',
      ebookprice: '',
      image: '',
      pdf: '',
      description: '',
      accent: '#2f4858',
      type: 'new',
    };
    this.editingIndex = null;
    this.editingId = null;
  }
}
