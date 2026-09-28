import { Component, OnInit } from '@angular/core';
import { CartService } from '../cart.service';
import { Integration } from '../services/integration';
import { PdfCover } from '../pdf-cover/pdf-cover';

type Book = {
  title: string;
  price: string;
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

  constructor(
    private integration: Integration,
    private cartService: CartService,
  ) {}

  ngOnInit(): void {
    this.integration.getBooks().subscribe({
      next: (books) => {
        this.featuredBooks = books.map((book) => ({
          title: book.title ?? 'Untitled Book',
          price: `₹${book.price ?? 0}`,
          image: book.image ?? 'https://placehold.co/600x400/eeeeee/222222?text=Book+Cover',
          pdf: book.pdf ?? '',
          description: book.description ?? 'No description provided yet.',
          accent: book.accent ?? '#2f4858',
        }));
      },
      error: () => {
        this.featuredBooks = [];
      },
    });
  }

  addToCart(product: { title: string; price: string }): void {
    this.cartService.addToCart(product);
  }

}
