import { Component } from '@angular/core';
import { Router, RouterOutlet, NavigationEnd } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { Menu } from './menu/menu';
// import { Signin } from './signin/signin';



@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet, FormsModule, Menu],
  templateUrl: './app.html',
  styleUrl: './app.css'
})
export class App {
  // readonly portals = [
  //   { name: 'CCRAS', url: 'https://ccras.nic.in/' },
  //   { name: 'Ayush Research Portal', url: 'https://ayushportal.nic.in/' },
  //   { name: 'Ayur Prakriti Web Portal', url: 'https://ccras.nic.in/ayur-prakriti-web-portal/' },
  //   { name: 'PDF Scheme', url: 'https://ccras.nic.in/application-invited-for-post-doctoral-fellowship-scheme-june-2025-batch/' },
  //   { name: 'PG STAR', url: 'https://pgstar2.ccras.org.in/' },
  //   { name: 'SPARK', url: 'https://spark.ccras.org.in/' },
  //   { name: 'E-BOOKS', url: 'http://ccras.res.in/ccras_ebooks/' }
  // ];

  // readonly quickLinks = [
  //   'NMPB',
  //   'Indian Pharmacopoeia Commission',
  //   'Ministry of Ayush',
  //   'Terms and Conditions',
  //   'Privacy Policy',
  //   'Refund & Return Policy'
  // ];

  

   

  //   this.showCheckout = true;
  //   this.showSignin = false;
  //   this.showLogin = false;
  //   this.orderMessage = '';
  // }

  // login(): void {
  //   const trimmedEmail = this.loginForm.email.trim();
  //   const trimmedPassword = this.loginForm.password.trim();

  //   if (!trimmedEmail || !trimmedPassword) {
  //     this.orderMessage = 'Please enter your email and password.';
  //     return;
  //   }

  //   this.isLoggedIn = true;
  //   this.showLogin = false;

  //   if (this.selectedBook) {
  //     this.addCartItemAfterLogin(this.selectedBook);
  //     this.showCheckout = true;
  //   }
  // }

  // addCartItemAfterLogin(book: Book): void {
  //   const existingItem = this.cart.find((item) => item.title === book.title);
  //   if (existingItem) {
  //     existingItem.quantity += 1;
  //   } else {
  //     this.cart.push({ title: book.title, price: book.price, quantity: 1 });
  //   }
  //   this.orderMessage = '';
  // }

  // placeOrder(): void {
  //   const { fullName, phone, address, city, pincode } = this.checkoutForm;

  //   if (!fullName || !phone || !address || !city || !pincode) {
  //     this.orderMessage = 'Please fill in all delivery details to continue.';
  //     return;
  //   }

  //   this.orderMessage = `Thank you, ${fullName}! Your order for ${this.cartCount} item(s) has been placed.`;
  //   this.cart = [];
  //   this.checkoutForm = {
  //     fullName: '',
  //     phone: '',
  //     address: '',
  //     city: '',
  //     pincode: ''
  //   };
  //   this.showCheckout = false;
  //   this.selectedBook = null;
  // }

  // closeLogin(): void {
  //   this.showLogin = false;
  //   this.selectedBook = null;
  //   this.orderMessage = '';
  // }
}
