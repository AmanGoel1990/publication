import { ChangeDetectionStrategy, Component, inject, signal } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { Integration } from '../services/integration';

const SESSION_KEY = 'mdniy-auth-session';

@Component({
  selector: 'app-admin',
  imports: [ReactiveFormsModule],
  templateUrl: './admin.html',
  styleUrl: './admin.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class Admin {
  private readonly formBuilder = inject(FormBuilder);
  private readonly integration = inject(Integration);
  private readonly router = inject(Router);

  readonly loginError = signal('');
  readonly loginForm = this.formBuilder.nonNullable.group({
    username: ['', Validators.required],
    password: ['', Validators.required],
  });

  submitLogin(): void {
    if (this.loginForm.invalid) {
      this.loginForm.markAllAsTouched();
      this.loginError.set('Please enter username and password.');
      return;
    }

    const { username, password } = this.loginForm.getRawValue();
    const trimmedUsername = username.trim();
    const trimmedPassword = password.trim();

    if (!trimmedUsername || !trimmedPassword) {
      this.loginError.set('Please enter username and password.');
      return;
    }

    this.loginError.set('');
    this.integration.doLogin({ username: trimmedUsername, password: trimmedPassword }).subscribe({
      next: (response) => {
        const role = String(response.role ?? response.userRole ?? response.roleName ?? '')
          .trim()
          .toLowerCase();

        if (!['admin', 'administrator'].includes(role) && (role || trimmedUsername.toLowerCase() !== 'admin')) {
          this.loginError.set('This account is not authorized for admin access.');
          return;
        }

        if (typeof localStorage !== 'undefined') {
          localStorage.setItem(SESSION_KEY, JSON.stringify({ username: trimmedUsername, role: 'admin' }));
        }

        this.router.navigate(['/dashboard']);
      },
      error: () => {
        this.loginError.set('Invalid username or password.');
      },
    });
  }
}
