import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AuthService } from '../auth.service';
import { HttpClientModule } from '@angular/common/http';

@Component({
  selector: 'app-browse-groups',
  standalone: true,
  imports: [CommonModule, HttpClientModule],
  templateUrl: './browse-groups.component.html',
})
export class BrowseGroupsComponent {
  publicGroups = [
    { title: 'Group 1', id: 1, users: 10, channels: 5 },
    { title: 'Group 2', id: 2, users: 20, channels: 8 },
    { title: 'Group 3', id: 3, users: 15, channels: 3 },
    { title: 'Group 4', id: 4, users: 12, channels: 6 },
  ];

  constructor(private authService: AuthService) {}

  requestAccess(group: any) {
    if (!this.isAccessRequested(group) && !this.isMember(group)) {
      this.authService
        .requestGroupAccess(group.id, group.title)
        .subscribe(() => {
          console.log(`Requested access to ${group.title}`);
        });
    }
  }

  isAccessRequested(group: any): boolean {
    const currentUser = this.authService.currentUserValue;
    if (currentUser && currentUser.groups) {
      return currentUser.groups.some(
        (userGroup) => userGroup.id === group.id && !userGroup.approved
      );
    }
    return false;
  }

  isMember(group: any): boolean {
    const currentUser = this.authService.currentUserValue;
    if (currentUser && currentUser.groups) {
      return currentUser.groups.some(
        (userGroup) => userGroup.id === group.id && userGroup.approved
      );
    }
    return false;
  }

  createGroup() {
    console.log('Creating a new group...');
  }
}
