import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AuthService } from '../services/auth-service.service';
import { AdminServiceService } from '../services/admin-service.service';
import { GroupServiceService } from '../services/group-service.service';

interface User {
  email: string;
  profilePictureRef: string;
  bio: string;
  role: string;
  username: string,
  token: string,
  groups: string[],
  groupRequests: string[],
  _id: string,
  reported?: boolean,
}

interface Group {
  _id: string,
  admins: string[],
  name: string;
  description: string,
  members: string[],
  memberRequests: string[],
  channels: string[],
}

@Component({
  selector: 'app-manage-users',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './manage-users.component.html',
})
export class ManageUsersComponent implements OnInit {
  isSuperAdmin = false;
  userSession: User | null = null;
  isLoggedIn = false;
  groups: Group[] = [];
  allUsers: User[] = [];

  constructor(
    private authService: AuthService,
    private adminService: AdminServiceService,
    private groupService: GroupServiceService
  ) {}

  ngOnInit() {
    this.isLoggedIn = this.authService.isAuthenticated();
    if (this.isLoggedIn) {
      this.userSession = this.authService.getUser();
      this.isSuperAdmin = this?.userSession?.role === 'super_admin' || false;
      //this.loadGroups();
      if (this.isSuperAdmin) {
        this.loadUsers();
      }
    } else {
      // Handle not logged in (e.g., redirect to login)
      console.error('User not logged in');
    }
  }

  loadGroups(): void {
    this.groupService.getAllGroups().subscribe(
      (response: any) => {
        if (response.success) {
          this.groups = response.groups;
        } else {
          console.error('Error loading groups:', response.message);
        }
      }
    );
  }

  loadUsers(): void {
    this.adminService.getAllUsers().subscribe(
      (response: any) => {
        if (response.success) {
          this.allUsers = response.users;
        } else {
          console.error('Error loading users:', response.message);
        }
      }
    );
  }

  promoteToGroupAdmin(username: string): void {
    this.adminService.promoteToGroupAdmin(username).subscribe(
      (response: any) => {
        if (response.success) {
          console.log('User promoted to group admin:', username);
          this.loadUsers();
        } else {
          console.error('Error promoting user to group admin:', response.message);
        }
      }
    );
  
  }

  promoteToSuperAdmin(username: string): void {
    this.adminService.promoteToSuperAdmin(username).subscribe(
      (response: any) => {
        if (response.success) {
          console.log('User promoted to super admin:', username);
          this.loadUsers();
        } else {
          console.error('Error promoting user to super admin:', response.message);
        }
      }
    );
  }

  removeFromGroup(group: Group, userId: string): void {

  }

  banFromChannel(group: Group, userId: string): void {

  }

  approveUser(group: Group, userId: string): void {

  }


  deleteUser(user: User): void {

  }

  isGroupAdmin(group: Group, userId: string): void {

  }

  getGroupAdminUsernames(group: Group): void {
    
  }
}
