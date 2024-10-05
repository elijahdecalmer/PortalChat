import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';

import { AuthService } from './auth-service.service';

@Injectable({
  providedIn: 'root',
})
export class GroupServiceService {
  private apiUrl = 'http://localhost:4000/api/groups';

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

  // Get all groups
  getAllGroups() {
    return this.http.post(`${this.apiUrl}/all`, {}, { headers: this.getHeaders() });
  }

  // Approve a user's request to join a group
  approveUser(groupId: string, userId: string) {
    return this.http.post(
      `${this.apiUrl}/acceptAccess`,
      { groupId, userId },
      { headers: this.getHeaders() }
    );
  }

  // Remove a user from a group
  removeUser(groupId: string, userId: string) {
    return this.http.post(
      `${this.apiUrl}/removeUser`,
      { groupId, userId },
      { headers: this.getHeaders() }
    );
  }

  // Ban a user from a channel
  banUser(groupId: string, channelId: string, userId: string) {
    return this.http.post(
      `${this.apiUrl}/banUser`,
      { groupId, channelId, userId },
      { headers: this.getHeaders() }
    );
  }

  // Create a new group
  createGroup(name: string, description: string) {
    return this.http.post(
      `${this.apiUrl}/createGroup`,
      { groupName: name, groupDescription: description },
      { headers: this.getHeaders() }
    );
  }

  // Request to join a group
  requestAccess(groupId: string) {
    return this.http.post(
      `${this.apiUrl}/requestAccess`,
      { groupId },
      { headers: this.getHeaders() }
    );
  }

  // Reject a user's request to join a group
  rejectUser(groupId: string, userId: string) {
    return this.http.post(
      `${this.apiUrl}/rejectAccess`,
      { groupId, userId },
      { headers: this.getHeaders() }
    );
  }


}
