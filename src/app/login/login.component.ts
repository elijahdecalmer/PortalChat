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
  username: string;
  password: string;
  errorMessage: string;

  constructor(private router: Router, private authService: AuthService) {
    this.username = '';
    this.password = '';
    this.errorMessage = '';
  }

  onSubmit(event: Event) {
    event.preventDefault();
    this.errorMessage = '';

    this.authService
      .login(this.username, this.password) // Call the login method from AuthService
      .pipe(
        catchError((error) => {
          this.errorMessage =
            'Login failed. Please try again. Error message: ' + error.message;
          return of(null);
        })
      )
      .subscribe((response: any) => {
        if (response?.token) {
          this.router.navigate(['/browsegroups']); // Navigate to the groups page upon success
        } else {
          this.errorMessage = response?.message || 'Invalid credentials.';
        }
      });
  }
}
