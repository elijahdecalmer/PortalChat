import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import {
  HttpClient,
  HttpClientModule,
  HttpHeaders,
} from '@angular/common/http';
import { catchError } from 'rxjs/operators';
import { of } from 'rxjs';

const httpOptions = {
  headers: new HttpHeaders({
    'Content-Type': 'application/json',
  }),
};

const BACKEND_URL = 'http://localhost:4000';

@Component({
  selector: 'app-register',
  standalone: true,
  imports: [FormsModule, CommonModule, HttpClientModule],
  templateUrl: './register.component.html',
})
export class RegisterComponent {
  username: string;
  password: string;
  email: string;
  errorMessage: string;
  successMessage: string;

  constructor(private router: Router, private httpClient: HttpClient) {
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

    this.httpClient
      .post<{ success: boolean; message: string }>(
        `${BACKEND_URL}/api/register`,
        { username: this.username, password: this.password, email: this.email },
        httpOptions
      )
      .pipe(
        catchError((error) => {
          this.errorMessage =
            'Registration failed. Please try again. Error message: ' +
            error.message;
          return of(null);
        })
      )
      .subscribe((response: any) => {
        if (response?.valid) {
          this.successMessage = 'Registration successful!';
        } else {
          this.errorMessage = response?.message || 'Registration failed.';
        }
      });
  }
}
