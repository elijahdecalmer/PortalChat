import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AuthService } from '../auth.service';
import { HttpClientModule } from '@angular/common/http';
import { tap } from 'rxjs/operators';

@Component({
  selector: 'app-browse-groups',
  standalone: true,
  imports: [CommonModule, HttpClientModule],
  templateUrl: './browse-groups.component.html',
})
export class BrowseGroupsComponent implements OnInit {
  groups: any[] = [];
  isSuperAdmin = false;
  isGroupAdmin = false;
  isRequestingGroupAdminPrivileges = false;
  title = 'PortalChat';
  userSession: any = null;

  constructor(private authService: AuthService) {}

  ngOnInit() {
    this.authService.user.subscribe((user) => {
      this.userSession = user;
      console.log('User session:', this.userSession);
      if (user) {
        this.isSuperAdmin = user.roles?.includes('Super Admin') || false;
        this.isGroupAdmin = user.roles?.includes('Group Admin') || false;
        this.isRequestingGroupAdminPrivileges =
          user.roles?.includes('Group Admin Request') || false;
        this.getAllGroups();
      } else {
        this.groups = [];
        this.isSuperAdmin = false;
      }
      console.log('Current user:', user);
      console.log('Current groups:', this.groups);
    });
  }

  requestAccess(group: any) {
    if (!this.isAccessRequested(group) && !this.isMember(group)) {
      this.authService
        .requestAccessToGroup(group.id, group.name)
        .pipe(
          tap(() => {
            console.log(`Requested access to ${group.title}`);
          })
        )
        .subscribe({
          next: () => console.log('Request access process completed.'),
          error: (error: any) => {
            console.error(`Failed to request access to ${group.title}`, error);
          },
        });
    }
  }

  isAccessRequested(group: any): boolean {
    const currentUser = this?.authService?.currentUserValue;
    if (currentUser && currentUser?.groups) {
      return currentUser.groups.some(
        (userGroup: { id: any; approved: any }) =>
          userGroup.id === group.id && !userGroup.approved
      );
    }
    return false;
  }

  isMember(group: any): boolean {
    const currentUser = this.authService.currentUserValue;
    if (currentUser && currentUser.groups) {
      return currentUser.groups.some(
        (userGroup: { id: any; approved: any }) =>
          userGroup.id === group.id && userGroup.approved
      );
    }
    return false;
  }

  getAllGroups() {
    this.authService
      .getGroups()
      .pipe(tap((response: any) => (this.groups = response.data)))
      .subscribe({
        next: () => console.log('Groups loaded successfully:', this.groups),
        error: (error: any) => console.error('Failed to load groups', error),
      });
  }

  createGroup() {
    const groupName = prompt('Enter the new group name:');
    if (groupName) {
      this.authService
        .createGroup(groupName)
        .pipe(
          tap((response) => {
            console.log(`Group "${groupName}" created successfully.`);
            this.getAllGroups(); // Reload groups after creating
          })
        )
        .subscribe({
          next: () => console.log('Group creation process completed.'),
          error: (error) => {
            console.error('Failed to create group', error);
          },
        });
    }
  }

  requestGroupAdminPrivileges() {
    this.authService
      .requestGroupAdminPrivileges(this.userSession.id)
      .pipe(
        tap((response: any) => {
          console.log('Requested group admin privileges successfully');
        })
      )
      .subscribe({
        next: () =>
          console.log('Requested group admin privileges successfully'),
        error: (error: any) =>
          console.error('Failed to request group admin privileges', error),
      });
  }
}
