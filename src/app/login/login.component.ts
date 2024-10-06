import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { AuthService } from '../services/auth-service.service';
import { catchError } from 'rxjs/operators';
import { of } from 'rxjs';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [FormsModule, CommonModule],
  templateUrl: './login.component.html',
})
export class LoginComponent {
  username: string = ''; // Two-way binding will automatically sync with input
  password: string = ''; // Two-way binding for password
  errorMessage: string = ''; // To store any error messages

  constructor(private router: Router, private authService: AuthService) {}

  // Method to handle form submission
  onSubmit(event: Event) {
    event.preventDefault(); // Prevent default form submission behavior

    // Clear any existing error messages before a new login attempt
    this.errorMessage = '';

    // Call the login method from AuthService
    this.authService
      .login(this.username, this.password)
      .pipe(
        // Handle login errors if any
        catchError((error) => {
          // Set a generic error message or append the server's error message
          this.errorMessage = `Login failed. Please try again. ${error?.error?.message ?? ''}`;
          return of(null); // Return an observable to continue the flow
        })
      )
      .subscribe((response) => {
        // Check if the response is successful
        if (response?.success) {
          // If login is successful, navigate to the desired route (e.g., groups page)
          this.router.navigate(['/browsegroups']);
        } else {
          // If login fails, set the error message from the response or show a default message
          this.errorMessage = response?.message || 'Login failed. Invalid credentials.';
        }
      });
  }
}
