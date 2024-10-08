import { Component, OnInit } from '@angular/core';
import { AuthService } from '../services/auth-service.service';
import { UserService } from '../services/user.service';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';

interface User {
  _id: string;
  email: string;
  username: string;
  profilePictureRef?: string;
  bio?: string;
  role: string;
}

@Component({
  selector: 'app-profile',
  standalone: true,
  imports: [FormsModule, CommonModule],
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.css']
})
export class ProfileComponent implements OnInit {
  user: User | null = null;
  isSuperAdmin = false;
  isGroupAdmin = false;
  bio: string = '';
  successMessage: string = '';
  errorMessage: string = '';

  constructor(
    private authService: AuthService,
    private userService: UserService
  ) {}

  ngOnInit(): void {
    this.authService.user.subscribe((user) => {
      this.user = user;
      if (user) {
        this.isSuperAdmin = user.role === 'super_admin';
        this.isGroupAdmin = user.role === 'group_admin';
        this.bio = user.bio || '';
      } else {
        this.isSuperAdmin = false;
        this.isGroupAdmin = false;
        this.bio = '';
      }
    });
  }

  refetchUser() {
    this.authService.refetchUser().subscribe(
      (user) => {
        // User data updated
      },
      (error) => {
        console.error('Error refetching user:', error);
      }
    );
  }

  uploadAvatar(event: any) {
    const file = event.target.files[0];
    if (file) {
      const formData = new FormData();
      formData.append('file', file); // Ensure the field name is 'file'
      this.userService.uploadAvatar(formData).subscribe(
        (response: any) => {
          this.successMessage = 'Profile picture updated successfully.';
          this.refetchUser();
        },
        (error) => {
          this.errorMessage = 'Error updating profile picture.';
          console.error('Error uploading avatar:', error);
        }
      );
    }
  }

  getProfilePictureUrl(): string {
    if (this.user && this.user.profilePictureRef) {
      return 'http://localhost:4000' + this.user.profilePictureRef;
    } else {
      return 'assets/default-avatar.png'; // Path to a default avatar image
    }
  }

  updateBio() {
    this.userService.updateBio(this.bio).subscribe(
      (response: any) => {
        if (response.success) {
          this.successMessage = 'Bio updated successfully.';
          this.refetchUser();
        }
      },
      (error) => {
        this.errorMessage = 'Error updating bio.';
        console.error('Error updating bio:', error);
      }
    );
  }
}
