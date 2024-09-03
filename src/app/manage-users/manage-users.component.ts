import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';

interface User {
  name: string;
  bio: string;
  isGroupAdmin: boolean;
  isSuperAdmin: boolean;
  groupsCreated: number;
  showMenu: boolean;
}

@Component({
  selector: 'app-manage-users',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './manage-users.component.html',
})
export class ManageUsersComponent {
  users: User[] = [
    {
      name: 'Alice Johnson',
      bio: 'Loves coding and coffee',
      isGroupAdmin: true,
      isSuperAdmin: false,
      groupsCreated: 5,
      showMenu: false,
    },
    {
      name: 'Bob Smith',
      bio: 'JavaScript enthusiast',
      isGroupAdmin: false,
      isSuperAdmin: false,
      groupsCreated: 3,
      showMenu: false,
    },
    {
      name: 'Charlie Davis',
      bio: 'Front-end developer',
      isGroupAdmin: false,
      isSuperAdmin: true,
      groupsCreated: 10,
      showMenu: false,
    },
    {
      name: 'Dana White',
      bio: 'Group lead and architect',
      isGroupAdmin: true,
      isSuperAdmin: true,
      groupsCreated: 8,
      showMenu: false,
    },
  ];

  promoteToGroupAdmin(user: User) {
    user.isGroupAdmin = true;
    console.log(`${user.name} promoted to Group Admin`);
  }

  promoteToSuperAdmin(user: User) {
    user.isSuperAdmin = true;
    console.log(`${user.name} promoted to Super Admin`);
  }

  deleteUser(user: User) {
    this.users = this.users.filter((u) => u !== user);
    console.log(`${user.name} deleted`);
  }
}
