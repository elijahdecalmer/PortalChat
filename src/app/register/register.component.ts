import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { AuthService } from '../services/auth-service.service'; // Import AuthService
import { catchError } from 'rxjs/operators';
import { of } from 'rxjs';

@Component({
  selector: 'app-register',
  standalone: true,
  imports: [FormsModule, CommonModule],
  templateUrl: './register.component.html',
})
export class RegisterComponent {
  username: string = ''; // Initialize variables for two-way binding
  password: string = ''; 
  email: string = ''; 
  errorMessage: string = ''; // Store any error messages
  successMessage: string = ''; // Store any success messages

  constructor(private router: Router, private authService: AuthService) {}

  // Function to handle form submission
  onSubmit(event: Event) {
    event.preventDefault(); // Prevent default form submission

    // Clear any previous messages
    this.errorMessage = '';
    this.successMessage = '';

    // Call the register method from AuthService
    this.authService
      .register(this.email, this.username, this.password)
      .pipe(
        // Handle errors and display an appropriate message
        catchError((error) => {
          this.errorMessage = `Registration failed. Please try again. ${error?.error?.message ?? ''}`;
          return of(null); // Return a null observable to continue
        })
      )
      .subscribe((response: any) => {
        if (response?.success) {
          // If registration is successful, display success message
          this.successMessage = 'Registration successful. Redirecting to groups page...';
          
          // wait a short time before redirecting (for user to see message)
          setTimeout(() => {
            this.router.navigate(['/browsegroups']); // Navigate to groups page after registration
          }, 1000);
          
        } else {
          // If there's an error, display the error message from the response or a default message
          this.errorMessage = response?.message || 'Registration failed. Please try again.';
        }
      });
  }
}
