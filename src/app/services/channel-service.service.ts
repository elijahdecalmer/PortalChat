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
    let headers = new HttpHeaders();
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

     // Delete a channel
    deleteChannel(groupId: string, channelId: string) {
    return this.http.post(
      `${this.apiUrl}/deleteChannel`,
      { groupId, channelId },
      { headers: this.getHeaders() }
    );
  }

  // Ban user from a chanel
  banUser(groupId: string, channelId: string, userId: string) {
    return this.http.post(
      `${this.apiUrl}/banUser`,
      { groupId, channelId, userId },
      { headers: this.getHeaders() }
    );
  }

  // Load a channel by ID
  getChannelDetails(channelId: string) {
    return this.http.post(
      `${this.apiUrl}/details`,
      { channelId },
      { headers: this.getHeaders() }
    );
  }


  // Upload a file
  uploadFile(file: FormData) {
    return this.http.post(`${this.apiUrl}/uploadFile`, file, {
      headers: this.getHeaders()
    });
  }
}
