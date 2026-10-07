import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { CartService } from '../cart.service';

type CartFormat = 'Hardcopy' | 'E-book';

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

  updateQuantity(
    title: string,
    format: CartFormat,
    quantity: number,
  ): void {
    let newQuantity = Math.floor(Number(quantity));

    if (!Number.isFinite(newQuantity) || newQuantity < 1) {
      newQuantity = 1;
    }

    this.cartService.updateQuantity(
      title,
      format,
      newQuantity,
    );
  }

  incrementQuantity(
    title: string,
    format: CartFormat,
  ): void {
    const item = this.cartItems.find(
      (cartItem) =>
        cartItem.title === title &&
        cartItem.format === format,
    );

    if (!item) {
      return;
    }

    this.updateQuantity(
      title,
      format,
      item.quantity + 1,
    );
  }

  decrementQuantity(
    title: string,
    format: CartFormat,
  ): void {
    const item = this.cartItems.find(
      (cartItem) =>
        cartItem.title === title &&
        cartItem.format === format,
    );

    if (!item) {
      return;
    }

    if (item.quantity <= 1) {
      this.removeItem(title, format);
      return;
    }

    this.updateQuantity(
      title,
      format,
      item.quantity - 1,
    );
  }

  removeItem(
    title: string,
    format: CartFormat,
  ): void {
    this.cartService.removeItem(
      title,
      format,
    );
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
