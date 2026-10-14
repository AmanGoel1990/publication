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

  constructor(
    private router: Router,
    private integration: Integration,
  ) {
    const savedSession = this.getSession();
    if (savedSession && ['user', 'customer'].includes(savedSession.role.toLowerCase())) {
      this.username = savedSession.username;
      this.isLoggedIn = true;
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
        )
          .trim()
          .toLowerCase()
          .replace(/^role[_\s-]?/, '');

        if (['admin', 'administrator'].includes(role) || trimmedUsername.toLowerCase() === 'admin') {
          this.loginError = 'Administrator accounts must sign in at the admin login page.';
          return;
        }

        if (role && !['user', 'customer'].includes(role)) {
          this.loginError = 'This account is not authorized for user sign in.';
          return;
        }

        this.isLoggedIn = true;
        this.saveSession(trimmedUsername, 'user');
        this.loginSuccess.emit();

        this.router.navigate(['/cart']);
      },
      error: () => {
        this.loginError = 'Invalid username or password.';
      },
    });
  }

  continueShopping(): void {
    this.router.navigate(['/cart']);
  }

  useAnotherAccount(): void {
    if (typeof localStorage !== 'undefined') {
      localStorage.removeItem(SESSION_KEY);
    }

    this.username = '';
    this.password = '';
    this.loginError = '';
    this.isLoggedIn = false;
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
