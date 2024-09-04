import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { HttpClient, HttpClientModule } from '@angular/common/http'; // Import HttpClient
import { tap } from 'rxjs/operators';

interface User {
  username: string;
  email: string;
  groups?: any[];
  id: number;
  roles: string[];
}

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  private userSubject = new BehaviorSubject<User | null>(null);
  public user: Observable<User | null> = this.userSubject.asObservable();
  private baseUrl = 'http://localhost:3000';

  constructor(private http: HttpClient) {
    // Inject HttpClient
    const storedUser = JSON.parse(sessionStorage.getItem('user') || 'null');
    this.userSubject = new BehaviorSubject<User | null>(storedUser);
    this.user = this.userSubject.asObservable();
  }

  login(userData: any): void {
    sessionStorage.setItem('user', JSON.stringify(userData));
    this.userSubject.next(userData);
  }

  logout(): void {
    sessionStorage.removeItem('user');
    this.userSubject.next(null);
  }

  public get currentUserValue(): User | null {
    return this.userSubject.value;
  }

  requestGroupAccess(groupId: number, groupName: string): Observable<any> {
    const currentUser = this.currentUserValue;
    if (currentUser) {
      return this.http
        .post(`${this.baseUrl}/api/groups/requestAccess`, {
          userId: currentUser.id,
          groupId: groupId,
          groupName: groupName,
        })
        .pipe(
          tap((response: any) => {
            if (response.valid) {
              sessionStorage.setItem('user', JSON.stringify(response.user));
              this.userSubject.next(response.user);
            }
          })
        );
    }
    return new Observable();
  }
}
