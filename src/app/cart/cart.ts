import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { CartService } from '../cart.service';

@Component({
  selector: 'app-cart',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './cart.html',
  styleUrl: './cart.css',
})
export class Cart {
  constructor(
    public cartService: CartService,
    private router: Router,
  ) {}

  get cartItems() {
    return this.cartService.items;
  }

  get cartCount(): number {
    return this.cartService.cartCount;
  }

  get cartTotal(): string {
    return `₹${this.cartService.cartTotal.toLocaleString('en-IN')}`;
  }

  getItemTotal(item: { price: string; quantity: number }): string {
    const numericPrice = Number(String(item.price).replace(/[^\d]/g, '')) || 0;
    return `₹${(numericPrice * item.quantity).toLocaleString('en-IN')}`;
  }

  updateQuantity(title: string, format: 'Hardcopy' | 'E-book', quantity: number): void {
    this.cartService.updateQuantity(title, format, quantity);
  }

  incrementQuantity(title: string, format: 'Hardcopy' | 'E-book'): void {
    const item = this.cartItems.find(
      (cartItem) => cartItem.title === title && cartItem.format === format,
    );

    if (item) {
      this.updateQuantity(title, format, item.quantity + 1);
    }
  }

  decrementQuantity(title: string, format: 'Hardcopy' | 'E-book'): void {
    const item = this.cartItems.find(
      (cartItem) => cartItem.title === title && cartItem.format === format,
    );

    if (item) {
      this.updateQuantity(title, format, item.quantity - 1);
    }
  }

  removeItem(title: string, format: 'Hardcopy' | 'E-book'): void {
    this.cartService.removeItem(title, format);
  }

  continueShopping(): void {
    this.router.navigate(['/']);
  }
}
