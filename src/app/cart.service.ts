import { Injectable, signal } from '@angular/core';

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
  private readonly itemsState = signal<CartItem[]>([]);

  get items(): CartItem[] {
    return this.itemsState();
  }

  set items(items: CartItem[]) {
    this.itemsState.set(items);
  }

  addToCart(item: { title: string; price: string; format?: 'Hardcopy' | 'E-book' }): void {
    const format = item.format ?? 'Hardcopy';
    this.itemsState.update((items) => {
      const existingItem = items.find(
        (cartItem) => cartItem.title === item.title && cartItem.format === format,
      );

      if (existingItem) {
        return items.map((cartItem) =>
          cartItem === existingItem
            ? { ...cartItem, quantity: cartItem.quantity + 1 }
            : cartItem,
        );
      }

      return [...items, { title: item.title, price: item.price, format, quantity: 1 }];
    });
  }

  updateQuantity(title: string, format: 'Hardcopy' | 'E-book', quantity: number): void {
    this.itemsState.update((items) =>
      items.map((item) =>
        item.title === title && item.format === format
          ? { ...item, quantity: Math.max(1, quantity) }
          : item,
      ),
    );
  }

  removeItem(title: string, format: 'Hardcopy' | 'E-book'): void {
    this.itemsState.update((items) =>
      items.filter((cartItem) => !(cartItem.title === title && cartItem.format === format)),
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
