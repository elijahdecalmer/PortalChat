import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class AdminServiceService {
  private apiUrl = 'http://localhost:4000/api/admin';
  private headers = new HttpHeaders({ 'Content-Type': 'application/json' });

  constructor(private http: HttpClient) {}

  // Promote a user to group admin
  promoteToGroupAdmin(username: string): Observable<any> {
    return this.http.post(`${this.apiUrl}/promote/group-admin`, { usernameToPromote: username }, { headers: this.headers });
  }

  // Promote a user to super admin
  promoteToSuperAdmin(username: string): Observable<any> {
    return this.http.post(`${this.apiUrl}/promote/super-admin`, { usernameToPromote: username }, { headers: this.headers });
  }

  // Delete a user
  deleteUser(userId: string): Observable<any> {
    return this.http.post(`${this.apiUrl}/deleteUser`, { userId }, { headers: this.headers });
  }
}
