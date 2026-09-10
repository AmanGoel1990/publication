import { Component } from '@angular/core';

// type CartItem = {
//   title: string;
//   price: string;
//   quantity: number;
// };
@Component({
  selector: 'app-menu',
  imports: [],
  templateUrl: './menu.html',
  styleUrl: './menu.css',
})
export class Menu {
  readonly navItems = ['Home', 'Publications', 'Special Offers', 'About MDNIY', 'Contact'];
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
