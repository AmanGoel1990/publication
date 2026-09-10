import { Component, EventEmitter, Output } from '@angular/core';
import { FormsModule } from '@angular/forms';

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

  email = '';
  password = '';

  submitLogin(): void {
    if (!this.email.trim() || !this.password.trim()) {
      return;
    }

    this.loginSuccess.emit();
  }

  cancelLogin(): void {
    this.cancel.emit();
  }
}
