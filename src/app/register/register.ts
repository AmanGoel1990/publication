import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';

@Component({
  selector: 'app-register',
  standalone: true,
  imports: [FormsModule],
  templateUrl: './register.html',
  styleUrl: './register.css',
})
export class Register {
  fullName = '';
  email = '';
  password = '';
  phone = '';

  constructor(private router: Router) {}

  submitRegister(): void {
    if (!this.fullName.trim() || !this.email.trim() || !this.password.trim()) {
      return;
    }
  }

  goToLogin(): void {
    this.router.navigate(['/signin']);
  }
}
