import { Component, EventEmitter, Output } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';

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

  constructor(private router: Router) {}
  // constructor(private integration: IntegrationService) {}

  // userForm: FormGroup = new FormGroup({
  //   email: new FormControl('', [Validators.required, Validators.email]),
  //   password: new FormControl('', [Validators.required]),
  // });


  submitLogin(): void {
    if (!this.email.trim() || !this.password.trim()) {
      return;
    }

    this.loginSuccess.emit();
  }

  goToRegister(): void {
    this.router.navigate(['/register']);
  }

  cancelLogin(): void {
    this.router.navigate(['/register']);
  }
}
