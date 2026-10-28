import { Component, HostListener } from '@angular/core';
import { CartService } from '../cart.service';
import { Integration } from '../services/integration';
import { PdfCover } from '../pdf-cover/pdf-cover';
import { Router } from '@angular/router';

type Book = {
  id: number | string;
  title: string;
  hardcopyPrice: string;
  ebookPrice: string;
  image: string;
  pdf: string;
  description: string;
  accent: string;
};
@Component({
  selector: 'app-home',
  imports: [PdfCover],
  templateUrl: './home.html',
  styleUrl: './home.css',
})
export class Home {
  readonly bookCovers = [
    { title: 'Yogasana - English', image: '/bookscover/Yogasana Cover English 2025.jpg.jpeg' },
    { title: 'Pranayama - English', image: '/bookscover/Pranayama Cover English 2025.jpg.jpeg' },
    { title: 'Shatkarma - English', image: '/bookscover/Shatkarma Cover English 2025 Final.jpg.jpeg' },
    { title: 'Yogasana - Hindi', image: '/bookscover/Yogasana Cover Hindi 2025.jpg.jpeg' },
    { title: 'Pranayama - Hindi', image: '/bookscover/Pranayama Cover Hindi 2025.jpg.jpeg' },
    { title: 'Sukshmayam', image: '/bookscover/Sukshmayam 5.5 X 8.5 FINAL.jpg.jpeg' },
    { title: 'Yoga Sutra Parichay', image: '/bookscover/Yoga Sutra Parocay.jpg.jpeg' },
    { title: 'Yoga Vijnana', image: '/bookscover/Yoga Vijnana.jpg.jpeg' },
    { title: 'Shatkarma - Hindi', image: '/bookscover/Shakarma Cover Hindi 2025 Final.jpg.jpeg' },
    { title: 'How to Manage Stress Through Yoga', image: '/bookscover/HOW TO MANAGE STRESS THROUGH.jpg.jpeg' },
  ];
  featuredBooks: Book[] = [];
  isLoading = true;
  hasLoadError = false;
  selectedCoverIndex: number | null = null;

  constructor(
    private integration: Integration,
    private cartService: CartService,
    private router: Router,
  ) {}

  ngOnInit(): void {
    this.integration.getBooks().subscribe({
      next: (books) => {
        this.featuredBooks = books
          .filter(
            (book) =>
              book.id !== undefined &&
              book.id !== null &&
              book.type === 'new'
          ).map((book) => ({
          id: book.id ?? '',
          title: book.title ?? 'Untitled Book',
          hardcopyPrice: `₹${book.hardcopyprice}`,
          ebookPrice: `₹${book.ebookprice}`,
          image: book.image ?? 'https://placehold.co/600x400/eeeeee/222222?text=Book+Cover',
          pdf: book.pdf ?? '',
          description: book.description ?? 'No description provided yet.',
          accent: book.accent ?? '#2f4858',
        }));
        this.isLoading = false;
      },
      error: () => {
        this.featuredBooks = [];
        this.isLoading = false;
        this.hasLoadError = true;
      },
    });
  }

  openCoverPreview(index: number): void {
    this.selectedCoverIndex = index;
  }

  closeCoverPreview(): void {
    this.selectedCoverIndex = null;
  }

  showPreviousCover(): void {
    if (this.selectedCoverIndex === null) return;
    this.selectedCoverIndex =
      (this.selectedCoverIndex - 1 + this.bookCovers.length) % this.bookCovers.length;
  }

  showNextCover(): void {
    if (this.selectedCoverIndex === null) return;
    this.selectedCoverIndex = (this.selectedCoverIndex + 1) % this.bookCovers.length;
  }

  @HostListener('document:keydown.escape')
  onEscape(): void {
    this.closeCoverPreview();
  }

  openBookDetails(book: Book): void {
    console.log('BOOK CLICKED:', book);
    this.router.navigate(['/book', book.id]);
  }
  addToCart(product: { title: string; price: string; format: 'Hardcopy' | 'E-book' }): void {
    this.cartService.addToCart(product);
  }

}
