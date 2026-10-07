import { Injectable, signal } from '@angular/core';

export type CartItem = {
  title: string;
  price: string;
  format: 'Hardcopy' | 'E-book';
  quantity: number;
};

const CART_STORAGE_KEY = 'mdniy-cart-items';

@Injectable({
  providedIn: 'root',
})
export class CartService {
  private readonly itemsState = signal<CartItem[]>(this.loadItems());

  get items(): CartItem[] {
    return this.itemsState();
  }

  set items(items: CartItem[]) {
    this.setItems(items);
  }

  addToCart(item: { title: string; price: string; format?: 'Hardcopy' | 'E-book' }): void {
    const format = item.format ?? 'Hardcopy';
    this.updateItems((items) => {
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
    this.updateItems((items) =>
      items.map((item) =>
        item.title === title && item.format === format
          ? { ...item, quantity: Math.max(1, quantity) }
          : item,
      ),
    );
  }

  removeItem(title: string, format: 'Hardcopy' | 'E-book'): void {
    this.updateItems((items) =>
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

  private loadItems(): CartItem[] {
    if (typeof localStorage === 'undefined') {
      return [];
    }

    try {
      const storedItems: unknown = JSON.parse(localStorage.getItem(CART_STORAGE_KEY) ?? '[]');
      if (
        Array.isArray(storedItems) &&
        storedItems.every(
          (item): item is CartItem =>
            typeof item?.title === 'string' &&
            typeof item?.price === 'string' &&
            (item?.format === 'Hardcopy' || item?.format === 'E-book') &&
            Number.isInteger(item?.quantity) &&
            item.quantity > 0,
        )
      ) {
        return storedItems;
      }

      console.error('Stored cart data is invalid.');
    } catch (error) {
      console.error('Failed to read stored cart data.', error);
    }

    return [];
  }

  private updateItems(update: (items: CartItem[]) => CartItem[]): void {
    this.setItems(update(this.itemsState()));
  }

  private setItems(items: CartItem[]): void {
    this.itemsState.set(items);

    if (typeof localStorage === 'undefined') {
      return;
    }

    try {
      localStorage.setItem(CART_STORAGE_KEY, JSON.stringify(items));
    } catch (error) {
      console.error('Failed to save cart data.', error);
    }
  }
}
