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
  readonly newBooks = signal<PublicationBook[]>([]);
  readonly oldBooks = signal<PublicationBook[]>([]);
  readonly isLoading = signal(true);
  readonly hasLoadError = signal(false);
  readonly bookGroups = computed(() => [
    { type: 'new', title: 'New Books', books: this.newBooks() },
    { type: 'old', title: 'Old Books', books: this.oldBooks() },
  ]);

  constructor(
    private integration: Integration,
    private cartService: CartService,
  ) {}

  addToCart(product: { title: string; price: string; format: 'Hardcopy' | 'E-book' }): void {
    this.cartService.addToCart(product);
  }

  ngOnInit(): void {
    this.integration.getBooks().subscribe({
      next: (books) => {
        const mappedBooks = books.map((book) => this.mapBook(book));
        this.newBooks.set(mappedBooks.filter((book) => book.type === 'new'));
        this.oldBooks.set(mappedBooks.filter((book) => book.type === 'old'));
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
      image: book.image ?? 'https://placehold.co/600x400/eeeeee/222222?text=Book+Cover',
      pdf: book.pdf ?? '',
      description: book.description ?? 'No description provided yet.',
      accent: book.accent ?? '#2f4858',
    };
  }
}
