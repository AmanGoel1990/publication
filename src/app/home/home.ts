import { Component, OnInit } from '@angular/core';
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
  featuredBooks: Book[] = [];
  isLoading = true;
  hasLoadError = false;

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
              book.id !== null
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
  openBookDetails(book: Book): void {
    console.log('BOOK CLICKED:', book);
    this.router.navigate(['/book', book.id]);
  }
  addToCart(product: { title: string; price: string; format: 'Hardcopy' | 'E-book' }): void {
    this.cartService.addToCart(product);
  }

}
