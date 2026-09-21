import { Component } from '@angular/core';
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

    this.integration
      .doRegister({
        fullName: trimmedFullName,
        username: trimmedUsername,
        email: trimmedEmail,
        phone: trimmedPhone,
        password: trimmedPassword,
      })
      .subscribe({
        next: () => {
          this.isRegistered = true;
        },
        error: () => {
          this.registerError = 'Registration failed. Please try again.';
        },
      });
  }

  goToLogin(): void {
    this.router.navigate(['/signin']);
  }
}
