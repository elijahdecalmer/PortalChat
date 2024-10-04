import { Component, OnInit } from '@angular/core';
import { AuthService } from '../services/auth-service.service';
import { GroupServiceService } from '../services/group-service.service';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ChannelServiceService } from '../services/channel-service.service';

@Component({
  selector: 'app-manage-groups',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './manage-groups.component.html',
})
export class ManageGroupsComponent implements OnInit {

  groups: any[] = [];
  isSuperAdmin = false;
  isGroupAdmin = false;
  isLoggedIn = false;
  userSession: any = null;
  newGroupName = '';
  newGroupDescription = '';
  newChannelNames: { [key: string]: string } = {};
  newChannelDescriptions: { [key: string]: string } = {}; 
  isModalOpen = false;
  newChannelName = '';
  newChannelDescription = '';
  currentGroupId: any | null = '';


  constructor(
    private authService: AuthService,
    private groupService: GroupServiceService,
    private channelService: ChannelServiceService
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

    // Method to create a new group
    createGroup(): void {
      if (this.newGroupName && this.newGroupDescription) {
        this.groupService
          .createGroup(this.newGroupName, this.newGroupDescription)
          .subscribe(
            (response: any) => {
              if (response.success) {
                // Clear the input fields after successful creation
                this.newGroupName = '';
                this.newGroupDescription = '';
                console.log('Group created successfully');
                this.loadGroups(); // Reload groups to display the new group
              } else {
                console.error('Error creating group:', response.message);
              }
            }
          );
      } else {
        console.error('Group name and description are required');
      }
    }

  // Method to create a channel within the selected group
  createChannel(): void {
    if (this.currentGroupId && this.newChannelName && this.newChannelDescription) {
      this.channelService
        .createChannel(this.currentGroupId, this.newChannelName, this.newChannelDescription)
        .subscribe((response: any) => {
          if (response.success) {
            console.log('Channel created successfully');
            this.loadGroups(); // Reload groups to display the new channel
            this.closeChannelModal(); // Close the modal after success
          } else {
            console.error('Error creating channel:', response.message);
          }
        });
    } else {
      console.log("Current Group ID: ", this.currentGroupId);
      console.log("New Channel Name: ", this.newChannelName);
      console.log("New Channel Description: ", this.newChannelDescription);
      console.error('Channel name is required');
    }
  }

    // Method to open the modal for creating a new channel
    openChannelModal(groupId: string): void {
      this.isModalOpen = true;
      this.currentGroupId = groupId;
      console.log("Current Group ID: ", groupId);
    }

    // Method to close the modal
    closeChannelModal(): void {
      this.isModalOpen = false;
      this.newChannelName = '';
      this.newChannelDescription = '';
      this.currentGroupId = null;
    }







}
