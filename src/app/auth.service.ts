import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable, of } from 'rxjs';
import { HttpClient } from '@angular/common/http';
import { catchError, tap } from 'rxjs/operators';
import { OperatorFunction } from 'rxjs';

interface User {
  username: string;
  email: string;
  groups?: any[];
  id: number;
  roles: string[];
  reported: boolean;
}

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  private userSubject = new BehaviorSubject<User | null>(null);
  public user: Observable<User | null> = this.userSubject.asObservable();
  private baseUrl = 'http://localhost:4000';

  constructor(private http: HttpClient) {
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

  public get currentUserValue(): any | null {
    return this.userSubject.value;
  }

  private updateUserSession(user: any): void {
    sessionStorage.setItem('user', JSON.stringify(user));
    this.userSubject.next(user);
  }

  fetchUserData(): Observable<any | null> {
    const currentUser = this.currentUserValue;
    if (currentUser) {
      const userId = currentUser.id; // Adjusted to directly get the id
      return this.http.post<any>(`${this.baseUrl}/api/user`, { userId }).pipe(
        tap((user: any) => {
          this.updateUserSession(user.data); // Update session and BehaviorSubject
          console.log('User data fetched and session updated:', user.data);
          console.log('User groups:', user.groups); // Debugging log
        }),
        catchError((error) => {
          console.error('Error fetching user data:', error);
          return of(null); // Handle error gracefully
        })
      );
    } else {
      return of(null);
    }
  }

  getGroups(): Observable<any> {
    return this.http
      .get(`${this.baseUrl}/api/groups`)
      .pipe(tap((response: any) => {}));
  }

  getAllUsers(): Observable<User[]> {
    return this.http.get<User[]>(`${this.baseUrl}/api/users`);
  }

  requestGroupAdminPrivileges(userId: number): Observable<any> {
    return this.http
      .post(`${this.baseUrl}/api/users/requestGroupAdmin`, { userId })
      .pipe(
        tap((response: any) => {
          this.fetchUserData().subscribe();
          console.log('Group Admin privileges requested');
        })
      );
  }

  promoteUserToGroupAdmin(userId: number): Observable<any> {
    return this.http
      .post(`${this.baseUrl}/api/users/${userId}/promoteToGroupAdmin`, {})
      .pipe(
        tap((response: any) => {
          console.log('User promoted to Group Admin');
        })
      );
  }

  promoteUserToSuperAdmin(userId: number): Observable<any> {
    return this.http
      .post(`${this.baseUrl}/api/users/${userId}/promoteToSuperAdmin`, {})
      .pipe(
        tap((response: any) => {
          console.log('User promoted to Super Admin');
        })
      );
  }

  removeUserFromGroup(groupId: number, userId: number): Observable<any> {
    console.log('GroupId:', groupId);
    console.log('UserId:', userId);
    return this.http
      .post(`${this.baseUrl}/api/groups/${groupId}/removeUser`, { userId })
      .pipe(
        tap((response: any) => {
          this.fetchUserData().subscribe();
          console.log('User removed from group');
        })
      );
  }

  banUserFromGroup(groupId: number, targetUsername: string): Observable<any> {
    const currentUser = this.currentUserValue;
    if (currentUser) {
      return this.http
        .post(`${this.baseUrl}/api/groups/${groupId}/banUser`, {
          userId: currentUser.id,
          targetUsername,
        })
        .pipe(
          tap((response: any) => {
            console.log('User banned and reported successfully');
          })
        );
    }
    return of(null);
  }

  sendMessage(
    groupId: number,
    channelId: string,
    message: string
  ): Observable<any> {
    const currentUser = this.currentUserValue;
    if (currentUser) {
      return this.http
        .post(
          `${this.baseUrl}/api/groups/${groupId}/channels/${channelId}/message`,
          {
            userId: currentUser.id,
            message,
          }
        )
        .pipe(
          tap((response: any) => {
            console.log('Message sent successfully:', response);
          }),
          catchError((error) => {
            console.error('Failed to send message:', error);
            return of(null); // Gracefully handle error
          })
        );
    }
    return of(null);
  }

  createGroup(groupName: string): Observable<any> {
    const currentUser = this.currentUserValue;
    if (currentUser) {
      return this.http
        .post(`${this.baseUrl}/api/groups/create`, {
          userId: currentUser.id,
          groupName,
        })
        .pipe(
          tap((response: any) => {
            console.log('Group created successfully:', response);
            this.fetchUserData().subscribe();
          }),
          catchError((error) => {
            console.error('Failed to create group:', error);
            return of(null);
          })
        );
    }
    return of(null);
  }

  requestAccessToGroup(groupId: number, groupName: string): Observable<any> {
    const currentUser = this.currentUserValue;
    console.log('Current user:', currentUser);
    if (currentUser) {
      return this.http
        .post(`${this.baseUrl}/api/groups/requestAccess`, {
          userId: currentUser?.id,
          groupId: groupId,
          groupName: groupName,
        })
        .pipe(
          tap((response: any) => {
            this.fetchUserData().subscribe();
            console.log(`Requested access to group: ${groupName}`);
            console.log('response', response);
          })
        );
    }
    return of(null);
  }

  approveUserForGroup(groupId: number, userId: any): Observable<any> {
    return this.http
      .post(`${this.baseUrl}/api/groups/${groupId}/approveUser`, { userId })
      .pipe(
        tap((response: any) => {
          console.log('User approved for group:', response);
        }),
        catchError((error) => {
          console.error('Error approving user for group:', error);
          return of(null); // Handle error gracefully
        })
      );
  }

  deleteAnotherAccount(userId: number): Observable<any> {
    const currentUser = this.currentUserValue;
    if (currentUser.roles.includes('Super Admin')) {
      return this.http
        .post(`${this.baseUrl}/api/account/delete`, {
          userId,
        })
        .pipe(
          tap((response: any) => {
            this.fetchUserData().subscribe();
          })
        );
    }
    return of(null);
  }

  deleteAccount(): Observable<any> {
    const currentUser = this.currentUserValue;
    if (currentUser) {
      return this.http
        .post(`${this.baseUrl}/api/account/delete`, {
          userId: currentUser.id,
        })
        .pipe(
          tap((response: any) => {
            if (response.valid) {
              sessionStorage.removeItem('user');
              this.userSubject.next(null);
            }
          })
        );
    }
    return of(null);
  }
}
