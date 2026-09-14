import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { CartService } from '../cart.service';

@Component({
  selector: 'app-menu',
  imports: [],
  templateUrl: './menu.html',
  styleUrl: './menu.css',
})
export class Menu {
  readonly navItems = ['Home', 'Publications', 'Special Offers', 'About MDNIY', 'Contact'];
  isCartOpen = false;
  isMenuOpen = true;

  constructor(
    public cartService: CartService,
    private router: Router,
  ) {}

  get cartCount(): number {
    return this.cartService.cartCount;
  }

  get cartItems() {
    return this.cartService.items;
  }

  get cartTotal(): string {
    return `₹${this.cartService.cartTotal.toLocaleString('en-IN')}`;
  }

  toggleCart(): void {
    this.isCartOpen = !this.isCartOpen;
  }

  toggleMenu(): void {
    this.isMenuOpen = !this.isMenuOpen;
  }

  proceedToPay(): void {
    this.router.navigate(['/signin']);
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
