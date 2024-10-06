import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { BehaviorSubject, Observable, of } from 'rxjs';
import { tap, catchError } from 'rxjs/operators';
import { Router } from '@angular/router';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private apiUrl = 'http://localhost:4000/api/auth';
  
  // BehaviorSubject to keep track of the user's session across components
  private userSubject = new BehaviorSubject<any>(null);
  public user = this.userSubject.asObservable();

  constructor(private http: HttpClient, private router: Router) {
    const userData = sessionStorage.getItem('user');
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
          sessionStorage.setItem('user', JSON.stringify(response.user));
          this.userSubject.next(response.user);
        }),
        catchError((error) => {
          console.error('Registration error:', error.error.message);
          return of(null);
        })
      );
  }

  // Function to log in a user
  login(username: string, password: string): Observable<any> {
    const loginData = { username, password };

    return this.http.post<any>(`${this.apiUrl}/login`, loginData)
      .pipe(
        tap((response) => {
          sessionStorage.setItem('user', JSON.stringify(response.user));
          this.userSubject.next(response.user);
        }),
        catchError((error) => {
          console.error('Login error:', error.error.message);
          return of(null);
        })
      );
  }

  // Function to refetch the user's session from the server
  refetchUser(): Observable<any> {
    const token = this.userSubject.value?.token;
    if (!token) {
      console.error('No token found for refetching user data');
      return of(null);
    }

    const headers = new HttpHeaders({
      'Authorization': `Bearer ${token}`
    });

    return this.http.post<any>(`${this.apiUrl}/refetchSelf`, {}, { headers }).pipe(
      tap((response) => {
        if (response?.success) {
          // Update the userSubject with the latest data
          sessionStorage.setItem('user', JSON.stringify(response.user));
          this.userSubject.next(response.user);
        }
      }),
      catchError((error) => {
        console.error('Error fetching user data:', error.error.message);
        return of(null);
      })
    );
  }

  // Function to log out a user
  logout() {
    sessionStorage.removeItem('user');
    this.userSubject.next(null);
    this.router.navigate(['/login']); // Redirect to login page after logout
  }

  // Delete account
  deleteAccount(): Observable<any> {
    const token = this.userSubject.value?.token;
    if (!token) {
      console.error('No token found for authorization');
      return of(null);
    }

    const headers = new HttpHeaders({
      'Authorization': `Bearer ${token}`
    });

    return this.http.post<any>(`${this.apiUrl}/deleteAccount`, {}, { headers })
      .pipe(
        tap((response) => {
          if (response?.success) {
            console.log('Account deleted successfully');
            this.logout(); // Log out user after account deletion
          } else {
            console.error('Error deleting account:', response?.message || 'Unknown error');
          }
        }),
        catchError((error) => {
          console.error('Error deleting account:', error.error.message);
          return of(null);
        })
      );
  }

  // Function to get the current user session
  getUser() {
    return this.userSubject.value;
  }

  // Check if the user is authenticated
  isAuthenticated(): boolean {
    return !!this.userSubject.value;
  }
}
