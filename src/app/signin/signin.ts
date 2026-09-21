import { Component, EventEmitter, Output } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { Integration } from '../services/integration';

@Component({
  selector: 'app-signin',
  standalone: true,
  imports: [FormsModule],
  templateUrl: './signin.html',
  styleUrl: './signin.css',
})
export class Signin {
  @Output() loginSuccess = new EventEmitter<void>();
  @Output() cancel = new EventEmitter<void>();

  username = '';
  password = '';
  loginError = '';
  isLoggedIn = false;

  constructor(
    private router: Router,
    private integration: Integration,
  ) {}

  submitLogin(): void {
    const trimmedUsername = this.username.trim();
    const trimmedPassword = this.password.trim();

    if (!trimmedUsername || !trimmedPassword) {
      this.loginError = 'Please enter username and password.';
      return;
    }

    this.loginError = '';

    this.integration.doLogin({ username: trimmedUsername, password: trimmedPassword }).subscribe({
      next: () => {
        this.isLoggedIn = true;
        this.loginSuccess.emit();
      },
      error: () => {
        this.loginError = 'Invalid username or password.';
      },
    });
  }

  continueShopping(): void {
    this.router.navigate(['/']);
  }

  goToRegister(): void {
    this.router.navigate(['/register']);
  }

  cancelLogin(): void {
    this.router.navigate(['/register']);
  }
}
