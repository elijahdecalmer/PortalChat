import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';

import { AuthService } from './auth-service.service';

@Injectable({
  providedIn: 'root',
})
export class AdminServiceService {
  private apiUrl = 'http://localhost:4000/api/admin';

  constructor(private http: HttpClient, private authService: AuthService) {}

  private getHeaders(): HttpHeaders {
    const user = this.authService.getUser();
    const token = user?.token;
    let headers = new HttpHeaders({ 'Content-Type': 'application/json' });
    if (token) {
      headers = headers.append('Authorization', `Bearer ${token}`);
    } else {
      console.error('No token found in user session');
    }
    return headers;
  }
  

  // Promote a user to group admin
  promoteToGroupAdmin(username: string) {
    return this.http.post(
      `${this.apiUrl}/promoteToGroupAdmin`,
      { usernameToPromote: username },
      { headers: this.getHeaders() }
    );
  }

  // Promote a user to super admin
  promoteToSuperAdmin(username: string) {
    return this.http.post(
      `${this.apiUrl}/promoteToSuperAdmin`,
      { usernameToPromote: username },
      { headers: this.getHeaders() }
    );
  }

  // Delete a user
  deleteUser(userId: string) {
    return this.http.post(
      `${this.apiUrl}/deleteUser`,
      { userId },
      { headers: this.getHeaders() }
    );
  }

  // Get all users
  getAllUsers() {
    return this.http.post(`${this.apiUrl}/allUsers`, {}, { headers: this.getHeaders() });
  }
  
  // Report a user to super admins
  reportUser(userId: string, message: string) {
    return this.http.post(
      `${this.apiUrl}/reportUser`,
      { userId, message },
      { headers: this.getHeaders() }
    );
  }

  // Get my groups that I administrate
  getMyGroups() {
    return this.http.post(`${this.apiUrl}/myGroups`, {}, { headers: this.getHeaders() });
  }
}
