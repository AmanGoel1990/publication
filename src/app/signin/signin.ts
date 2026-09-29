import { Component, EventEmitter, Output } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { Integration } from '../services/integration';

const SESSION_KEY = 'mdniy-auth-session';

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
  isUserRole = false;

  constructor(
    private router: Router,
    private integration: Integration,
  ) {
    const savedSession = this.getSession();
    if (savedSession) {
      this.username = savedSession.username;
      this.isLoggedIn = true;
      this.isUserRole = savedSession.role === 'user' || savedSession.role === 'customer';
    }
  }

  ngOnInit(): void {
    if (this.isLoggedIn) {
      this.router.navigate([this.isUserRole ? '/cart' : '/dashboard']);
    }
  }

  submitLogin(): void {
    const trimmedUsername = this.username.trim();
    const trimmedPassword = this.password.trim();

    if (!trimmedUsername || !trimmedPassword) {
      this.loginError = 'Please enter username and password.';
      return;
    }

    this.loginError = '';

    this.integration.doLogin({ username: trimmedUsername, password: trimmedPassword }).subscribe({
      next: (response) => {
        const role = String(
          (response as { role?: string; userRole?: string; roleName?: string } | undefined)?.role ??
            (response as { role?: string; userRole?: string; roleName?: string } | undefined)?.userRole ??
            (response as { role?: string; userRole?: string; roleName?: string } | undefined)?.roleName ??
            '',
        ).trim().toLowerCase();

        this.isUserRole = role === 'user' || role === 'customer' || (!role && trimmedUsername.toLowerCase() !== 'admin');
        this.isLoggedIn = true;
        this.saveSession(trimmedUsername, this.isUserRole ? 'user' : 'admin');
        this.loginSuccess.emit();

        this.router.navigate([this.isUserRole ? '/cart' : '/dashboard']);
      },
      error: () => {
        this.loginError = 'Invalid username or password.';
      },
    });
  }

  continueShopping(): void {
    this.router.navigate([this.isUserRole ? '/cart' : '/dashboard']);
  }

  goToRegister(): void {
    this.router.navigate(['/register']);
  }

  cancelLogin(): void {
    this.router.navigate(['/register']);
  }

  private getSession(): { username: string; role: string } | null {
    if (typeof localStorage === 'undefined') {
      return null;
    }

    try {
      const session = localStorage.getItem(SESSION_KEY);
      return session ? JSON.parse(session) : null;
    } catch {
      return null;
    }
  }

  private saveSession(username: string, role: string): void {
    if (typeof localStorage === 'undefined') {
      return;
    }

    localStorage.setItem(SESSION_KEY, JSON.stringify({ username, role }));
  }

}
