import { Component, ElementRef, inject } from '@angular/core';
import { Router, RouterLink } from '@angular/router';
import { CartService } from '../cart.service';

@Component({
  selector: 'app-menu',
  imports: [RouterLink],
  host: {
    '(document:click)': 'closeCartOnOutsideClick($event)',
  },
  templateUrl: './menu.html',
  styleUrl: './menu.css',
})
export class Menu {
  private readonly elementRef = inject(ElementRef<HTMLElement>);

  // readonly navItems = ['Home', 'Publications', 'Special Offers', 'About MDNIY', 'Contact'];
  readonly navItems = ['Home', 'Publications', 'About', 'Contact'];
  isCartOpen = false;
  isMenuOpen = true;

  constructor(
    public cartService: CartService,
    private router: Router,
  ) {}

  get isLoggedIn(): boolean {
    return typeof localStorage !== 'undefined' && !!localStorage.getItem('mdniy-auth-session');
  }

  get currentUser(): string {
    if (typeof localStorage === 'undefined') {
      return 'User';
    }

    try {
      const session = localStorage.getItem('mdniy-auth-session');
      return session ? JSON.parse(session).username ?? 'User' : 'User';
    } catch {
      return 'User';
    }
  }

  get cartCount(): number {
    return this.cartService.cartCount;
  }

  get cartItems() {
    return this.cartService.items;
  }

  get cartTotal(): string {
    return `₹${this.cartService.cartTotal.toLocaleString('en-IN')}`;
  }
  increaseQuantity(item: any): void {
    this.cartService.updateQuantity(
      item.title,
      item.format,
      item.quantity + 1
    );
  }

  decreaseQuantity(item: any): void {
    if (item.quantity <= 1) {
      this.cartService.removeItem(item.title, item.format);
      return;
    }

    this.cartService.updateQuantity(
      item.title,
      item.format,
      item.quantity - 1
    );
  }
  updateQuantity(item: any, event: Event): void {
    const input = event.target as HTMLInputElement;

    let quantity = Number(input.value);

    if (!Number.isInteger(quantity) || quantity < 1) {
      quantity = 1;
    }

    this.cartService.updateQuantity(
      item.title,
      item.format,
      quantity
    );
  }

  getItemTotal(item: any): number {
  const price = Number(
    String(item.price).replace(/[^\d.-]/g, '')
  ) || 0;

  const quantity = Number(item.quantity) || 1;

  return price * quantity;
}
  toggleCart(): void {
    this.isCartOpen = !this.isCartOpen;
  }

  closeCartOnOutsideClick(event: MouseEvent): void {
    const cartWrapper = this.elementRef.nativeElement.querySelector('.cart-wrapper');
    if (cartWrapper && event.target instanceof Node && !cartWrapper.contains(event.target)) {
      this.isCartOpen = false;
    }
  }

  toggleMenu(): void {
    this.isMenuOpen = !this.isMenuOpen;
  }

  navigateToItem(item: string): void {
    if (item === 'Home') {
      this.router.navigate(['/']);
      return;
    }

    if (item === 'Publications') {
      this.router.navigate(['/publication']);
    }
    if (item === 'About') {
      this.router.navigate(['/about']);
    }
    if (item === 'Contact') {
      this.router.navigate(['/contact']);
    }
  }

  proceedToPay(): void {
    this.router.navigate(['/signin']);
  }

  openLogin(): void {
    if (this.isLoggedIn) {
      const currentPage = typeof localStorage !== 'undefined' ? localStorage.getItem('mdniy-last-page') || '/' : '/';
      this.router.navigateByUrl(currentPage);
      return;
    }

    this.router.navigate(['/signin']);
  }
  

  logout(): void {
    if (typeof localStorage !== 'undefined') {
      localStorage.removeItem('mdniy-auth-session');
    }
    this.router.navigate(['/']);
  }
}
//   isLoggedIn = false;
//   showSignin = false;
//   showLogin = false;
//   showCheckout = false;
//   selectedBook: Book | null = null;
  
//   loginForm = {
//     email: '',
//     password: ''
//   };
//   checkoutForm = {
//     fullName: '',
//     phone: '',
//     address: '',
//     city: '',
//     pincode: ''
//   };
//   orderMessage = '';

  

  
//   cart: CartItem[] = [];
  
//   get cartCount(): number {
//     return this.cart.reduce((total, item) => total + item.quantity, 0);
//   }

//   get cartTotal(): number {
//     return this.cart.reduce((total, item) => {
//       const numericPrice = Number(String(item.price).replace(/[^\d]/g, '')) || 0;
//       return total + numericPrice * item.quantity;
//     }, 0);
//   }
// //    const existingItem = this.cart.find((item) => item.title === book.title);
// //     if (existingItem) {
// //       existingItem.quantity += 1;
// //     } else {
// //       this.cart.push({ title: book.title, price: book.price, quantity: 1 });
// //     }
// //     addToCart(book: Book): void {
// //     this.selectedBook = book;

// //     if (!this.isLoggedIn) {
// //       this.showSignin = true;
// //       this.showLogin = false;
// //       this.showCheckout = false;
// //       this.orderMessage = '';
// //       return;
// //     }
// //   }
// // }
// // 

// //   
