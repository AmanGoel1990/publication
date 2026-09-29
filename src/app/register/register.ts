import { Component } from '@angular/core';
import { HttpErrorResponse } from '@angular/common/http';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { Integration } from '../services/integration';

@Component({
  selector: 'app-register',
  standalone: true,
  imports: [FormsModule],
  templateUrl: './register.html',
  styleUrl: './register.css',
})
export class Register {
  fullName = '';
  username = '';
  email = '';
  password = '';
  phone = '';
  registerError = '';
  isSubmitting = false;
  isRegistered = false;

  constructor(
    private router: Router,
    private integration: Integration,
  ) {}

  submitRegister(): void {
    const trimmedFullName = this.fullName.trim();
    const trimmedUsername = this.username.trim();
    const trimmedEmail = this.email.trim();
    const trimmedPhone = this.phone.replace(/\D/g, '').trim();
    const trimmedPassword = this.password.trim();

    if (!trimmedFullName || !trimmedUsername || !trimmedEmail || !trimmedPhone || !trimmedPassword) {
      this.registerError = 'Please fill in all required fields.';
      return;
    }

    this.phone = trimmedPhone;
    this.registerError = '';
    this.isSubmitting = true;

    this.integration
      .doRegister({
        fullName: trimmedFullName,
        username: trimmedUsername,
        email: trimmedEmail,
        phone: trimmedPhone,
        password: trimmedPassword,
      })
      .subscribe({
        next: (response) => {
          this.isSubmitting = false;
          if (response.message?.trim().toLowerCase() === 'user registered successfully') {
            this.isRegistered = true;
          } else {
            this.registerError = response.message || 'Registration failed. Please try again.';
          }
        },
        error: (error: unknown) => {
          this.isSubmitting = false;
          this.registerError = this.getRegistrationError(error);
        },
      });
  }

  goToLogin(): void {
    this.router.navigate(['/signin']);
  }

  private getRegistrationError(error: unknown): string {
    if (error instanceof HttpErrorResponse) {
      const responseBody = error.error as { message?: unknown } | string | null;

      if (typeof responseBody === 'string' && responseBody.trim()) {
        return responseBody;
      }

      if (responseBody && typeof responseBody === 'object' && typeof responseBody.message === 'string') {
        return responseBody.message;
      }

      if (error.status === 0) {
        return 'Could not reach the registration API. Check that the backend is running.';
      }

      return `Registration failed (HTTP ${error.status}). Please try again.`;
    }

    return 'Registration failed. Please try again.';
  }
}
