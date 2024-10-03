import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { BehaviorSubject, Observable } from 'rxjs';
import { tap, catchError } from 'rxjs/operators';
import { Router } from '@angular/router';
import { of } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private apiUrl = 'http://localhost:4000/api/auth';
  
  // BehaviorSubject to keep track of the user's session across components
  private userSubject = new BehaviorSubject<any>(null);
  public user = this.userSubject.asObservable();

  constructor(private http: HttpClient, private router: Router) {
    // On service init, check if the user session exists in localStorage
    const userData = localStorage.getItem('user');
    if (userData) {
      this.userSubject.next(JSON.parse(userData));
    }
  }

  // Function to register a user
  register(email: string, username: string, password: string, role?: string): Observable<any> {
    const userData = { email, username, password, role };

    return this.http.post<any>(`${this.apiUrl}/register`, userData)
      .pipe(
        tap((response) => {
          // Save user data to localStorage
          localStorage.setItem('user', JSON.stringify(response));
          this.userSubject.next(response);
        }),
        catchError((error) => {
          console.error('Registration error:', error);
          return of(null); // Gracefully handle error
        })
      );
  }

  // Function to log in a user
  login(username: string, password: string): Observable<any> {
    const loginData = { username, password };

    return this.http.post<any>(`${this.apiUrl}/login`, loginData)
      .pipe(
        tap((response) => {
          // Save user data to localStorage
          localStorage.setItem('user', JSON.stringify(response));
          this.userSubject.next(response);
        }),
        catchError((error) => {
          console.error('Login error:', error);
          return of(null); // Gracefully handle error
        })
      );
  }

  // Function to log out a user
  logout() {
    // Clear user session from localStorage and notify the app
    localStorage.removeItem('user');
    this.userSubject.next(null);
    this.router.navigate(['/login']); // Redirect to login page after logout
  }

  // Delete account
  deleteAccount(): Observable<any> {
    // Assume that there's an endpoint `/deleteAccount` in your server for deleting the account
    const headers = new HttpHeaders({
      'Authorization': this.userSubject.value?.token // Use token from the user object
    });

    return this.http.delete<any>(`${this.apiUrl}/deleteAccount`, { headers })
      .pipe(
        tap(() => {
          this.logout(); // Log out user after account deletion
        }),
        catchError((error) => {
          console.error('Error deleting account:', error);
          return of(null); // Gracefully handle error
        })
      );
  }

  // Function to get the current user session (as an object)
  getUser() {
    return this.userSubject.value;
  }

  // Check if the user is authenticated
  isAuthenticated(): boolean {
    return !!this.userSubject.value;
  }
}
