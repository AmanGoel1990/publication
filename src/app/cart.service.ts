import { Injectable } from '@angular/core';

export type CartItem = {
  title: string;
  price: string;
  format: 'Hardcopy' | 'E-book';
  quantity: number;
};

@Injectable({
  providedIn: 'root',
})
export class CartService {
  items: CartItem[] = [];

  addToCart(item: { title: string; price: string; format?: 'Hardcopy' | 'E-book' }): void {
    const format = item.format ?? 'Hardcopy';
    const existingItem = this.items.find(
      (cartItem) => cartItem.title === item.title && cartItem.format === format,
    );

    if (existingItem) {
      existingItem.quantity += 1;
      return;
    }

    this.items.push({
      title: item.title,
      price: item.price,
      format,
      quantity: 1,
    });
  }

  updateQuantity(title: string, format: 'Hardcopy' | 'E-book', quantity: number): void {
    const item = this.items.find(
      (cartItem) => cartItem.title === title && cartItem.format === format,
    );

    if (!item) {
      return;
    }

    item.quantity = Math.max(1, quantity);
  }

  removeItem(title: string, format: 'Hardcopy' | 'E-book'): void {
    this.items = this.items.filter(
      (cartItem) => !(cartItem.title === title && cartItem.format === format),
    );
  }

  get cartCount(): number {
    return this.items.reduce((total, item) => total + item.quantity, 0);
  }

  get cartTotal(): number {
    return this.items.reduce((total, item) => {
      const numericPrice = Number(String(item.price).replace(/[^\d]/g, '')) || 0;
      return total + numericPrice * item.quantity;
    }, 0);
  }
}
