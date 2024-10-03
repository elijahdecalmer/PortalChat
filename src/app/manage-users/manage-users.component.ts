import { Component, OnInit } from '@angular/core';
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

  constructor() {}

  ngOnInit() {
    
  }

  loadGroups(): void {
   
  }

  loadUsers(): void {
    if (this.isSuperAdmin) {
      
    }
  }

  promoteToGroupAdmin(user: User): void {
   
  }

  promoteToSuperAdmin(user: User): void {
    
  }

  removeFromGroup(group: Group, userName: any): void {
    const user = this.allUsers.find((u) => u.username === userName);
    if (user && !user.roles.includes('Super Admin')) {
     
    }
  }

  banFromChannel(group: Group, user: User): void {
   
  }

  approveUser(group: Group, username: string): void {
    const user = this.allUsers.find((u) => u.username === username);
    
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
   
  }
}
