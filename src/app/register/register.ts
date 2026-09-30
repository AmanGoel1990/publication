import { ChangeDetectorRef, Component } from '@angular/core';
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
  name = '';
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
    private changeDetectorRef: ChangeDetectorRef,
  ) {}

  allowOnlyNumbers(event: KeyboardEvent): void {
    const allowedKeys = [
      'Backspace',
      'Delete',
      'Tab',
      'ArrowLeft',
      'ArrowRight',
      'Home',
      'End',
    ];

    if (allowedKeys.includes(event.key)) {
      return;
    }

    if (!/^[0-9]$/.test(event.key)) {
      event.preventDefault();
    }
  }

  filterPhone(): void {
    this.phone = this.phone
      .replace(/[^0-9]/g, '')
      .slice(0, 10);
  }

  submitRegister(): void {
    const trimmedName = this.name.trim();
    const trimmedUsername = this.username.trim();
    const trimmedEmail = this.email.trim();
    const trimmedPhone = this.phone.replace(/[^0-9]/g, '').slice(0, 10);
    const trimmedPassword = this.password.trim();

    if (!trimmedName || !trimmedUsername || !trimmedEmail || !trimmedPhone || !trimmedPassword) {
      this.registerError = 'Please fill in all required fields.';
      return;
    }
    if (trimmedPhone.length !== 10) {
      this.registerError = 'Phone number must be exactly 10 digits.';
      return;
    }

    this.phone = trimmedPhone;
    this.registerError = '';
    this.isSubmitting = true;

    this.integration
      .doRegister({
        name: trimmedName,
        username: trimmedUsername,
        email: trimmedEmail,
        phone: trimmedPhone,
        password: trimmedPassword,
      })
      .subscribe({
        next: () => {
          this.isSubmitting = false;
          this.isRegistered = true;
          this.changeDetectorRef.markForCheck();
        },
        error: (error: unknown) => {
          this.isSubmitting = false;
          this.registerError = this.getRegistrationError(error);
          this.changeDetectorRef.markForCheck();
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
