import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class GroupServiceService {
  private apiUrl = 'http://localhost:4000/api/groups';
  private headers = new HttpHeaders({ 'Content-Type': 'application/json' });

  constructor(private http: HttpClient) {}

  // Get all groups for the logged-in user
  getMyGroups(): Observable<any> {
    return this.http.post(`${this.apiUrl}/myGroups`, {}, { headers: this.headers });
  }

  // Get all groups
  getAllGroups(): Observable<any> {
    return this.http.post(`${this.apiUrl}/all`, {}, { headers: this.headers });
  }

  // Approve a user's request to join a group
  approveUser(groupId: string, userId: string): Observable<any> {
    return this.http.post(`${this.apiUrl}/acceptAccess`, { groupId, userId }, { headers: this.headers });
  }

  // Request access to a group
  requestAccess(groupId: string): Observable<any> {
    return this.http.post(`${this.apiUrl}/requestAccess`, { groupId }, { headers: this.headers });
  }

  // Delete a group
  deleteGroup(groupId: string): Observable<any> {
    return this.http.post(`${this.apiUrl}/deleteGroup`, { groupId }, { headers: this.headers });
  }

  // Remove a user from a group
  removeUser(groupId: string, userId: string): Observable<any> {
    return this.http.post(`${this.apiUrl}/removeUser`, { groupId, userId }, { headers: this.headers });
  }

  // Ban a user from a channel
  banUser(groupId: string, channelId: string, userId: string): Observable<any> {
    return this.http.post(`${this.apiUrl}/banUser`, { groupId, channelId, userId }, { headers: this.headers });
  }
}
