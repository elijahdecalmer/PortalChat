import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HttpClientModule } from '@angular/common/http';
import { GroupServiceService } from '../services/group-service.service';
import { AuthService } from '../services/auth-service.service';
import { FormsModule } from '@angular/forms'; // Import FormsModule for ngModel binding

@Component({
  selector: 'app-browse-groups',
  standalone: true,
  imports: [CommonModule, HttpClientModule, FormsModule], // Add FormsModule
  templateUrl: './browse-groups.component.html',
})
export class BrowseGroupsComponent implements OnInit {
  groups: any[] = [];
  newGroupName = ''; // New group name input
  newGroupDescription = ''; // New group description input
  isSuperAdmin = false;
  isGroupAdmin = false;
  isLoggedIn = false;
  userSession: any = null;

  constructor(
    private authService: AuthService,
    private groupService: GroupServiceService
  ) {}

  ngOnInit() {
    this.isLoggedIn = this.authService.isAuthenticated();
    if (this.isLoggedIn) {
      this.userSession = this.authService.getUser();
      this.isSuperAdmin = this.userSession?.role === 'super_admin';
      this.isGroupAdmin = this.userSession?.role === 'group_admin';
      this.loadGroups();
    } else {
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

  // Check if the user is already a member of the group
  isMember(group: any): boolean {
    const isMember = group.members.some((member: any) => {
      return member._id == this.userSession?._id
    });
    return isMember;
  }

  // Check if the user has a pending request to join the group
  isRequestPending(group: any): boolean {
    return group.memberRequests.some((request: any) => {
      return request._id == this.userSession?._id
  });
  }

  // Method to request joining a group
  requestToJoin(groupId: string): void {
    console.log('Requesting to join group:', groupId);
    this.groupService.requestAccess(groupId).subscribe(
      (response: any) => {
        if (response.success) {
          console.log('Request to join group sent successfully');
          this.loadGroups(); // Reload groups to reflect the pending request
          this.authService.refetchUser().subscribe((user) => {
          
          });
        } else {
          console.error('Error sending request:', response.message);
        }
      }
    );
  }

}
