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
import { AuthService } from '../auth.service';

const httpOptions = {
  headers: new HttpHeaders({
    'Content-Type': 'application/json',
  }),
};

const BACKEND_URL = 'http://localhost:4000';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [FormsModule, CommonModule, HttpClientModule],
  templateUrl: './login.component.html',
})
export class LoginComponent {
  username: string;
  password: string;
  errorMessage: string;

  constructor(
    private router: Router,
    private httpClient: HttpClient,
    private authService: AuthService
  ) {
    this.username = '';
    this.password = '';
    this.errorMessage = '';
  }

  onSubmit(event: Event) {
    event.preventDefault();
    this.errorMessage = '';

    this.httpClient
      .post<{
        valid: boolean;
        username: string;
        email: string;
        id: number;
        roles: string[];
        groups?: string[];
      }>(
        `${BACKEND_URL}/api/auth`,
        { username: this.username, password: this.password },
        httpOptions
      )
      .pipe(
        catchError((error) => {
          this.errorMessage =
            'Login failed. Please try again. Error message: ' + error.message;
          return of(null);
        })
      )
      .subscribe((response: any) => {
        if (response?.valid) {
          const { data } = response;
          this.authService.login(data);
          this.router.navigate(['/browsegroups']);
        } else {
          this.errorMessage = response?.message || 'Invalid credentials.';
        }
      });
  }
}
