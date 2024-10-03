import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
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

  constructor() {}

  ngOnInit() {
    
  }

  requestAccess(group: any) {

  }

  isAccessRequested(group: any): boolean {
   
    return false;
  }

  isMember(group: any): void {
    
  }

  getAllGroups() {
    
  }

  createGroup() {
    const groupName = prompt('Enter the new group name:');
    if (groupName) {
     
    }
  }

  requestGroupAdminPrivileges() {
    
  }
}
