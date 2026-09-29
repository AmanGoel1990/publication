import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { CartService } from '../cart.service';

@Component({
  selector: 'app-cart',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './cart.html',
  styleUrl: './cart.css',
})
export class Cart {
  showBilling = false;

  billingForm = {
    fullName: '',
    email: '',
    phone: '',
    address: '',
    city: '',
    pincode: '',
  };

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

  proceedToCheckout(): void {
    this.showBilling = true;
  }

  placeOrder(): void {
    const { fullName, email, phone, address, city, pincode } = this.billingForm;
    const hasRequiredFields = fullName && email && phone && address && city && pincode;

    if (!hasRequiredFields) {
      return;
    }

    this.cartService.items = [];
    this.showBilling = false;
    this.router.navigate(['/']);
  }

  continueShopping(): void {
    this.router.navigate(['/']);
  }
}
