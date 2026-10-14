import { CommonModule, NgOptimizedImage } from '@angular/common';
import { ChangeDetectorRef, Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { HttpErrorResponse } from '@angular/common/http';
import { Router, RouterLink } from '@angular/router';
import { finalize } from 'rxjs';
import { ApiUser, Integration } from '../services/integration';

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
  imports: [CommonModule, FormsModule, NgOptimizedImage, RouterLink],
  templateUrl: './dashboard.html',
  styleUrl: './dashboard.css',
})
export class Dashboard implements OnInit {
  @ViewChild('bookPdfInput') bookPdfInput?: ElementRef<HTMLInputElement>;

  books: DashboardBook[] = [];
  users: ApiUser[] = [];
  activeSection: 'books' | 'users' = 'books';
  isBookFormOpen = false;
  usersLoading = false;
  usersError = '';
  private usersLoaded = false;

  editingIndex: number | null = null;
  editingId: number | string | null = null;
  uploadingPdf = false;
  uploadError = '';
  saveSuccess = '';
  pendingPdf: File | null = null;
  pendingDelete: { index: number; title: string } | null = null;

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

  constructor(
    private integration: Integration,
    private changeDetectorRef: ChangeDetectorRef,
    private router: Router,
  ) {}

  ngOnInit(): void {
    this.loadBooks();
  }

  logout(): void {
    if (typeof localStorage !== 'undefined') {
      localStorage.removeItem('mdniy-auth-session');
    }

    this.router.navigate(['/admin']);
  }

  selectSection(section: 'books' | 'users'): void {
    this.activeSection = section;
    if (section === 'users' && !this.usersLoaded && !this.usersLoading) {
      this.loadUsers();
    }
  }

  private loadUsers(): void {
    this.usersLoading = true;
    this.usersError = '';
    this.integration.getUsers().subscribe({
      next: (users) => {
        this.users = users;
        this.usersLoaded = true;
        this.usersLoading = false;
      },
      error: () => {
        this.usersLoading = false;
        this.usersError = 'Users could not be loaded. Check that the users API is available.';
      },
    });
  }

  openNewBookForm(): void {
    this.resetForm();
    this.saveSuccess = '';
    this.isBookFormOpen = true;
  }

  closeBookForm(): void {
    if (this.uploadingPdf) {
      return;
    }

    this.resetForm();
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
    this.saveSuccess = '';

    if (this.pendingPdf) {
      this.integration.uploadBookPdf(this.pendingPdf).subscribe({
        next: ({ pdfUrl }) => {
          this.form.pdf = pdfUrl;
          this.pendingPdf = null;
          this.changeDetectorRef.markForCheck();
          this.saveBook();
        },
        error: (error: HttpErrorResponse) => {
          this.uploadError = error.error?.message ?? 'Upload failed. Check that the upload server is running.';
          this.uploadingPdf = false;
          this.changeDetectorRef.markForCheck();
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
      this.uploadingPdf = false;
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
      this.integration.updateBook(this.editingId, book).pipe(
        finalize(() => {
          this.uploadingPdf = false;
          this.changeDetectorRef.markForCheck();
        }),
      ).subscribe({
        next: (updatedBook) => {
          this.books[this.editingIndex as number] = this.mapBook(updatedBook);
          this.resetForm();
          this.saveSuccess = 'Book updated successfully.';
        },
        error: (error: HttpErrorResponse) => {
          this.uploadError = error.error?.message ?? 'Book could not be saved. Please try again.';
        },
      });
      return;
    }

    this.integration.addBook(book).pipe(
      finalize(() => {
        this.uploadingPdf = false;
        this.changeDetectorRef.markForCheck();
      }),
    ).subscribe({
      next: (createdBook) => {
        this.books.unshift(this.mapBook(createdBook));
        this.resetForm();
        this.saveSuccess = 'Book added successfully.';
      },
      error: (error: HttpErrorResponse) => {
        this.uploadError = error.error?.message ?? 'Book could not be saved. Please try again.';
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
    this.uploadError = '';
    this.saveSuccess = '';
    this.isBookFormOpen = true;
  }

  deleteBook(index: number): void {
    const selected = this.books[index];
    this.pendingDelete = { index, title: selected.title };
  }

  cancelDelete(): void {
    this.pendingDelete = null;
  }

  confirmDelete(): void {
    const pendingDelete = this.pendingDelete;
    if (!pendingDelete) {
      return;
    }

    this.pendingDelete = null;
    const selected = this.books[pendingDelete.index];
    const id = selected.id;

    if (id !== undefined && id !== null) {
      this.integration.deleteBook(id).subscribe({
        next: () => {
          window.location.reload();
        },
      });
      return;
    }

    this.books.splice(pendingDelete.index, 1);

    if (this.editingIndex === pendingDelete.index) {
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
    this.isBookFormOpen = false;
  }
}
