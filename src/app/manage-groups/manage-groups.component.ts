import { Component, OnInit } from '@angular/core';
import { AuthService } from '../services/auth-service.service';
import { GroupServiceService } from '../services/group-service.service';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ChannelServiceService } from '../services/channel-service.service';
import { ExcludeAdminsPipe } from '../pipes/exclude-admins.pipe';
import { AdminServiceService } from '../services/admin-service.service';

@Component({
  selector: 'app-manage-groups',
  standalone: true,
  imports: [CommonModule, FormsModule, ExcludeAdminsPipe],
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
  isBanModalOpen = false;
  currentUserId: any | null = '';
  selectedChannelId: any | null = '';
  newChannelName = '';
  newChannelDescription = '';
  currentGroupId: any | null = '';
  currentGroupChannels: any[] = [];
  isReportModalOpen = false;
  reportMessage: string = '';


  constructor(
    private authService: AuthService,
    private groupService: GroupServiceService,
    private channelService: ChannelServiceService,
    private adminService: AdminServiceService
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

  // Display number of member requests
  numberOfMemberRequests(groupId: string): number {
    const group = this.groups.find((group) => group._id === groupId);
    return group?.memberRequests?.length || 0;
  }

  // Display number of members
  numberOfMembers(groupId: string): number {
    const group = this.groups.find((group) => group._id === groupId);
    return group?.members?.length || 0;
  }



  // loadGroups(): void {
  //   this.groupService.getAllGroups().subscribe(
  //     (response: any) => {
  //       if (response.success) {
  //         this.groups = response.groups;
  //       } else {
  //         console.error('Error loading groups:', response.message);
  //       }
  //     }
  //   );
  // }

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

      // Method to open the ban modal and set up necessary data
      openBanModal(groupId: string, userId: string): void {
        this.currentGroupId = groupId;
        this.currentUserId = userId;
        const group = this.groups.find((g) => g._id === groupId);
        this.currentGroupChannels = group.channels;
        this.isBanModalOpen = true;
      }

      // Method to close the ban modal
      closeBanModal(): void {
        this.isBanModalOpen = false;
        this.currentGroupId = null;
        this.currentUserId = null;
        this.selectedChannelId = null;
      }

        // Method to open the modal for reporting a user
      openReportModal(userId: string): void {
        this.currentUserId = userId;
        this.isReportModalOpen = true;
      }

      // Method to close the report modal
      closeReportModal(): void {
        this.isReportModalOpen = false;
        this.reportMessage = '';  // Clear the message when closing the modal
        this.currentUserId = null;
      }

    // Delete a channel
    deleteChannel(groupId: string, channelId: string): void {
      this.channelService.deleteChannel(groupId, channelId).subscribe((response: any) => {
        if (response.success) {
          console.log('Channel deleted successfully');
          this.loadGroups(); // Reload groups to reflect the changes
        } else {
          console.error('Error deleting channel:', response.message);
        }
      });
    }

    // Remove a user from a group
    removeUser(groupId: string, userId: string): void {
      this.groupService.removeUser(groupId, userId).subscribe((response: any) => {
        if (response.success) {
          console.log('User removed successfully');
          this.loadGroups(); // Reload groups to reflect the changes
        } else {
          console.error('Error removing user:', response.message);
        }
      });
    }

    // Approve a user's request to join a group
    approveUser(groupId: string, userId: string): void {
      this.groupService.approveUser(groupId, userId).subscribe((response: any) => {
        if (response.success) {
          console.log('User approved successfully');
          this.loadGroups(); // Reload groups to reflect the changes
        } else {
          console.error('Error approving user:', response.message);
        }
      });
    }

    // Reject user's request to join a group
    rejectUser(groupId: string, userId: string): void {
      this.groupService.rejectUser(groupId, userId).subscribe((response: any) => {
        if (response.success) {
          console.log('User rejected successfully');
          this.loadGroups(); // Reload groups to reflect the changes
        } else {
          console.error('Error rejecting user:', response.message);
        }
      });
    }


    // Method to ban a user from the selected channel
    banUserFromChannel(): void {
      if (this.currentGroupId && this.currentUserId && this.selectedChannelId) {
        this.channelService.banUser(this.currentGroupId, this.selectedChannelId, this.currentUserId)
          .subscribe((response: any) => {
            if (response.success) {
              console.log('User banned successfully from channel');
              this.loadGroups(); // Reload the group data
              this.closeBanModal(); // Close the modal after success
            } else {
              console.error('Error banning user:', response.message);
            }
          });
      } else {
        console.error('Group ID, User ID, and Channel ID are required');
      }
    }

    // Report a user to super admins
    reportUser(userId: string, message: string): void {
      this.adminService.reportUser(userId, message).subscribe((response: any) => {
        if (response.success) {
          console.log('User reported successfully');
          this.closeReportModal(); // Close the modal after success
        } else {
          console.error('Error reporting user:', response.message);
        }
      });
    }

    // Get all groups that I administrate
    loadGroups(): void {
      this.adminService.getMyGroups().subscribe((response: any) => {
        if (response.success) {
          this.groups = response.groups;
        } else {
          console.error('Error getting my groups:', response.message);
        }
      });
    }

}
