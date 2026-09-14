import { Injectable } from '@angular/core';

export type CartItem = {
  title: string;
  price: string;
  quantity: number;
};

@Injectable({
  providedIn: 'root',
})
export class CartService {
  items: CartItem[] = [];

  addToCart(item: { title: string; price: string }): void {
    const existingItem = this.items.find((cartItem) => cartItem.title === item.title);

    if (existingItem) {
      existingItem.quantity += 1;
      return;
    }

    this.items.push({
      title: item.title,
      price: item.price,
      quantity: 1,
    });
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
