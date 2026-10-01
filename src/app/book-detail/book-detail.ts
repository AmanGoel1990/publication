import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { CartService } from '../cart.service';
import { Integration } from '../services/integration';
import { PdfCover } from '../pdf-cover/pdf-cover';

type Book = {
  id?: number | string;
  title: string;
  hardcopyPrice: string;
  ebookPrice: string;
  image: string;
  pdf: string;
  description: string;
  accent: string;
};

@Component({
  selector: 'app-book-detail',
  imports: [PdfCover],
  templateUrl: './book-detail.html',
  styleUrl: './book-detail.css',
})
export class BookDetail implements OnInit {

  book: Book | null = null;
  isLoading = true;

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private integration: Integration,
    private cartService: CartService,
  ) {}

  ngOnInit(): void {
    const bookId = this.route.snapshot.paramMap.get('id');

    if (!bookId) {
      this.router.navigate(['/']);
      return;
    }

    this.integration.getBooks().subscribe({
      next: (books) => {

        const selectedBook = books.find(
          (book) => String(book.id) === String(bookId)
        );

        if (!selectedBook) {
          this.router.navigate(['/']);
          return;
        }

        if (selectedBook.id === undefined || selectedBook.id === null) {
          console.error('Book ID is missing:', selectedBook);
          this.router.navigate(['/']);
          return;
        }

        this.book = {
          id: selectedBook.id,
          title: selectedBook.title ?? 'Untitled Book',
          hardcopyPrice: `₹${selectedBook.hardcopyprice}`,
          ebookPrice: `₹${selectedBook.ebookprice}`,
          image:
            selectedBook.image ??
            'https://placehold.co/600x400/eeeeee/222222?text=Book+Cover',
          pdf: selectedBook.pdf ?? '',
          description:
            selectedBook.description ?? 'No description provided yet.',
          accent: selectedBook.accent ?? '#2f4858',
        };

        this.isLoading = false;
      },

      error: (error) => {
        console.error('Failed to load book:', error);
        this.isLoading = false;
      },
    });
  }

  goBack(): void {
    this.router.navigate(['/']);
  }

  addToCart(
    book: Book,
    format: 'Hardcopy' | 'E-book'
  ): void {

    const price =
      format === 'Hardcopy'
        ? book.hardcopyPrice
        : book.ebookPrice;

    this.cartService.addToCart({
      title: book.title,
      price: price,
      format: format,
    });
  }
}
