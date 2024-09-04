import { Component, OnInit } from '@angular/core';
import { AuthService } from '../auth.service';
import { Observable, tap } from 'rxjs';
import { CommonModule } from '@angular/common';
import { HttpClientModule } from '@angular/common/http';

interface User {
  username: string;
  email: string;
  groups?: any[];
  requestedGroupAdmin?: boolean;
  id: number;
  roles: string[];
  reported: boolean;
}

interface Group {
  id: number;
  name: string;
  admin: string;
  members: any[];
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
  userSession: User | null = null;
  isLoggedIn = false;
  groups: Group[] = [];
  allUsers: User[] = [];

  constructor(private authService: AuthService) {}

  ngOnInit() {
    this.authService.user.subscribe((user) => {
      this.userSession = user;
      if (user) {
        this.isLoggedIn = true;
        this.groups = user.groups || [];
        this.isSuperAdmin = user.roles?.includes('Super Admin') || false;
        this.loadGroups();
        this.loadUsers();
      } else {
        this.groups = [];
        this.isSuperAdmin = false;
        this.isLoggedIn = false;
      }
    });
  }

  loadGroups(): void {
    this.authService
      .getGroups()
      .pipe(tap((response: any) => (this.groups = response.data)))
      .subscribe({
        next: () => console.log('Groups loaded successfully:', this.groups),
        error: (error: any) => console.error('Failed to load groups', error),
      });
  }

  loadUsers(): void {
    if (this.isSuperAdmin) {
      this.authService
        .getAllUsers()
        .pipe(tap((response: any) => (this.allUsers = response.data)))
        .subscribe({
          next: () => console.log('Users loaded successfully:', this.allUsers),
          error: (error: any) => console.error('Failed to load users', error),
        });
    }
  }

  promoteToGroupAdmin(user: User): void {
    this.authService
      .promoteUserToGroupAdmin(user.id)
      .pipe(
        tap(() => {
          user.roles.push('Group Admin');
        })
      )
      .subscribe({
        next: () => console.log(`${user.username} promoted to Group Admin`),
        error: (error: any) =>
          console.error('Failed to promote to Group Admin', error),
      });
  }

  promoteToSuperAdmin(user: User): void {
    this.authService
      .promoteUserToSuperAdmin(user.id)
      .pipe(
        tap(() => {
          user.roles.push('Super Admin');
        })
      )
      .subscribe({
        next: () => console.log(`${user.username} promoted to Super Admin`),
        error: (error: any) =>
          console.error('Failed to promote to Super Admin', error),
      });
  }

  removeFromGroup(group: Group, userName: any): void {
    const user = this.allUsers.find((u) => u.username === userName);
    if (user && !user.roles.includes('Super Admin')) {
      this.authService
        .removeUserFromGroup(group.id, user.id)
        .pipe(
          tap(() => {
            group.members = group.members.filter(
              (u) => u.username !== user.username
            );
          })
        )
        .subscribe({
          next: () =>
            console.log(`${user.username} removed from group ${group.name}`),
          error: (error: any) =>
            console.error('Failed to remove user from group', error),
        });
    }
  }

  banFromChannel(group: Group, user: User): void {
    this.authService
      .banUserFromGroup(group.id, user.username)
      .pipe(
        tap(() => {
          user.reported = true;
          group.bannedUsers.push(user.username);
        })
      )
      .subscribe({
        next: () =>
          console.log(`${user.username} banned from group ${group.name}`),
        error: (error: any) =>
          console.error('Failed to ban user from group', error),
      });
  }

  approveUser(group: Group, username: string): void {
    const user = this.allUsers.find((u) => u.username === username);
    this.authService
      .approveUserForGroup(group.id, user?.id)
      .pipe(
        tap(() => {
          // Remove the user from pendingRequests and add to members
          group.pendingRequests = group.pendingRequests.filter(
            (u) => u.id !== user?.id
          );
          group.members.push(user);

          console.log(`${user?.username} approved and added to ${group.name}`);
        })
      )
      .subscribe({
        next: () =>
          console.log(`User ${user?.username} approved successfully.`),
        error: (error: any) => console.error('Failed to approve user:', error),
      });
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
    this.authService.deleteAnotherAccount(user.id).subscribe({
      next: () => {
        console.log(`${user.username} deleted successfully`);
      },
      error: (error: any) =>
        console.error('Failed to delete user account', error),
    });
  }
}
