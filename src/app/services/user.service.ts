import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { AuthService } from './auth-service.service';


@Injectable({
  providedIn: 'root'
})
export class UserService {
  apiUrl = 'http://localhost:4000/api/users';

  constructor(
    private http: HttpClient,
    private authService: AuthService) {}


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


    // Upload a file
    uploadAvatar(file: FormData) {
      return this.http.post(`${this.apiUrl}/updateAvatar`, file, {
        headers: this.getHeaders()
      });
    }

    updateBio(bio: string) {
      const body = { bio };
      return this.http.post(`${this.apiUrl}/bio`, body, {
        headers: this.getHeaders()
      });
    }
    
}
