interface User {
  username: string;
  email: string;
  groups?: any[];
}

import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  private userSubject = new BehaviorSubject<User | null>(null);
  public user: Observable<any> = this.userSubject.asObservable();

  constructor() {
    const storedUser = JSON.parse(sessionStorage.getItem('user') || 'null');
    this.userSubject = new BehaviorSubject<any>(storedUser);
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

  public get currentUserValue(): any {
    return this.userSubject.value;
  }
}
