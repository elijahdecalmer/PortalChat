import { Component, OnInit } from '@angular/core';
import { AuthService } from '../auth.service';
import { Observable, tap } from 'rxjs';
import { CommonModule } from '@angular/common';
import { HttpClientModule } from '@angular/common/http';

interface User {
  username: string;
  email: string;
  groups?: any[];
  id: number;
  roles: string[];
  reported: boolean;
}

interface Group {
  id: number;
  name: string;
  admin: string;
  members: User[];
  pendingRequests: User[];
  channels: any[];
  bannedUsers: string[];
}

@Component({
  selector: 'app-manage-users',
  standalone: true,
  imports: [CommonModule, HttpClientModule],
  templateUrl: './manage-users.component.html',
})
export class ManageUsersComponent implements OnInit {
  isSuperAdmin = false;
  groups: Group[] = [];
  allUsers: User[] = [];

  constructor(private authService: AuthService) {}

  ngOnInit(): void {
    this.loadGroups();
    this.loadUsers();
    this.isSuperAdmin =
      this.authService.currentUserValue?.roles.includes('Super Admin') || false;
  }

  loadGroups(): void {
    this.authService
      .getGroups()
      .pipe(tap((response: any) => (this.groups = response.data)))
      .subscribe({
        next: () => {
          console.log('Groups loaded successfully:', this.groups);
        },
        error: (error: any) => {
          console.error('Failed to load groups', error);
        },
      });
  }

  loadUsers(): void {
    if (this.isSuperAdmin) {
      this.authService.getAllUsers().subscribe(
        (users: User[]) => {
          this.allUsers = users;
        },
        (error: any) => {
          console.error('Failed to load users', error);
        }
      );
    }
  }

  promoteToGroupAdmin(user: User): void {
    this.authService.promoteUserToGroupAdmin(user.id).subscribe(
      () => {
        user.roles.push('Group Admin');
        console.log(`${user.username} promoted to Group Admin`);
      },
      (error: any) => {
        console.error('Failed to promote to Group Admin', error);
      }
    );
  }

  promoteToSuperAdmin(user: User): void {
    this.authService.promoteUserToSuperAdmin(user.id).subscribe(
      () => {
        user.roles.push('Super Admin');
        console.log(`${user.username} promoted to Super Admin`);
      },
      (error: any) => {
        console.error('Failed to promote to Super Admin', error);
      }
    );
  }

  removeFromGroup(group: Group, user: User): void {
    this.authService.removeUserFromGroup(group.id, user.id).subscribe(
      () => {
        group.members = group.members.filter(
          (u) => u.username !== user.username
        );
        console.log(`${user.username} removed from ${group.name}`);
      },
      (error: any) => {
        console.error('Failed to remove user from group', error);
      }
    );
  }

  banFromChannel(group: Group, user: User): void {
    this.authService.banUserFromGroup(group.id, user.username).subscribe(
      () => {
        user.reported = true;
        group.bannedUsers.push(user.username);
        console.log(`${user.username} banned from group ${group.name}`);
      },
      (error: any) => {
        console.error('Failed to ban user from group', error);
      }
    );
  }

  approveUser(group: Group, user: User): void {
    // Simulate approving a user (should be replaced with actual API call)
    group.pendingRequests = group.pendingRequests.filter(
      (u) => u.username !== user.username
    );
    group.members.push(user);
    console.log(`${user.username} approved and added to ${group.name}`);
  }

  denyUser(group: Group, user: User): void {
    // Simulate denying a user (should be replaced with actual API call)
    group.pendingRequests = group.pendingRequests.filter(
      (u) => u.username !== user.username
    );
    console.log(`${user.username} denied from joining ${group.name}`);
  }

  deleteUser(user: User): void {
    // Simulate deleting a user (should be replaced with actual API call)
    this.allUsers = this.allUsers.filter((u) => u.username !== user.username);
    console.log(`${user.username} deleted from system`);
  }
}
