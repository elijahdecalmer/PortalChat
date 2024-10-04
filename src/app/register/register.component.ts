import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { AuthService } from '../services/auth-service.service'; // Import AuthService

@Component({
  selector: 'app-register',
  standalone: true,
  imports: [FormsModule, CommonModule],
  templateUrl: './register.component.html',
})
export class RegisterComponent {
  username: string;
  password: string;
  email: string;
  errorMessage: string;
  successMessage: string;

  constructor(private router: Router, private authService: AuthService) {
    this.username = '';
    this.password = '';
    this.email = '';
    this.errorMessage = '';
    this.successMessage = '';
  }

  onSubmit(event: Event) {
    event.preventDefault();
    this.errorMessage = '';
    this.successMessage = '';

    this.authService
      .register(this.email, this.username, this.password) // Call the service method
      .subscribe((response: any) => {
        if (response?.token) {
          this.router.navigate(['/browsegroups']); // Navigate to the groups page upon success
        } else {
          this.errorMessage = response?.message || 'Invalid credentials.';
        }
  });
  }
}
