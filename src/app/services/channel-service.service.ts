import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { AuthService } from './auth-service.service';

@Injectable({
  providedIn: 'root'
})
export class ChannelServiceService {
  private apiUrl = 'http://localhost:4000/api/channels';

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


    // Create a new channel in a group
    createChannel(groupId: string, channelName: string, channelDescription: string) {
      return this.http.post(
        `${this.apiUrl}/createChannel`,
        { groupId, channelName, channelDescription },
        { headers: this.getHeaders() }
      );
    }


}
