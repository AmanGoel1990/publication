import { Component, OnInit, computed, signal } from '@angular/core';
import { CartService } from '../cart.service';
import { Integration } from '../services/integration';
import { PdfCover } from '../pdf-cover/pdf-cover';

type PublicationBook = {
  id?: number | string;
  title: string;
  author: string;
  type: 'new' | 'old';
  hardcopyPrice: string;
  ebookPrice: string;
  stock: number;
  image: string;
  pdf: string;
  description: string;
  accent: string;
};

@Component({
  selector: 'app-publication',
  standalone: true,
  imports: [PdfCover],
  templateUrl: './publication.html',
  styleUrl: './publication.css',
})
export class Publication implements OnInit {
  readonly books = signal<PublicationBook[]>([]);
  readonly searchQuery = signal('');
  readonly isLoading = signal(true);
  readonly hasLoadError = signal(false);
  readonly filteredBooks = computed(() => {
    const query = this.searchQuery().trim().toLowerCase();

    if (!query) {
      return this.books();
    }

    return this.books().filter((book) =>
      `${book.title} ${book.author} ${book.description}`.toLowerCase().includes(query),
    );
  });

  constructor(
    private integration: Integration,
    private cartService: CartService,
  ) {}

  addToCart(product: {
    bookId?: number | string;
    title: string;
    price: string;
    format: 'Hardcopy' | 'E-book';
    stock?: number;
  }): void {
    this.cartService.addToCart(product);
  }

  updateSearch(event: Event): void {
    this.searchQuery.set((event.target as HTMLInputElement).value);
  }

  clearSearch(): void {
    this.searchQuery.set('');
  }

  ngOnInit(): void {
    this.integration.getBooks().subscribe({
      next: (books) => {
        this.books.set(books.map((book) => this.mapBook(book)));
        this.isLoading.set(false);
      },
      error: () => {
        this.hasLoadError.set(true);
        this.isLoading.set(false);
      },
    });
  }

  private mapBook(book: {
    id?: number | string;
    title?: string;
    author?: string;
    type?: 'new' | 'old';
    hardcopyprice?: string | number;
    ebookprice?: string | number;
    stock?: string | number;
    price?: string | number;
    image?: string;
    pdf?: string;
    description?: string;
    accent?: string;
  }): PublicationBook {
    return {
      id: book.id,
      title: book.title ?? 'Untitled Book',
      author: book.author ?? '',
      type: book.type === 'old' ? 'old' : 'new',
      hardcopyPrice: `₹${book.hardcopyprice ?? book.price ?? 0}`,
      ebookPrice: `₹${book.ebookprice ?? 0}`,
      stock: Math.max(0, Math.floor(Number(book.stock ?? 0) || 0)),
      image: book.image ?? 'https://placehold.co/600x400/eeeeee/222222?text=Book+Cover',
      pdf: book.pdf ?? '',
      description: book.description ?? 'No description provided yet.',
      accent: book.accent ?? '#2f4858',
    };
  }
}
