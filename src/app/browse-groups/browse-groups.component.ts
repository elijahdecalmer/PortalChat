import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-browse-groups',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './browse-groups.component.html',
})
export class BrowseGroupsComponent {
  publicGroups = [
    { title: 'Group 1', id: 53, users: 10, channels: 5 },
    { title: 'Group 2', id: 5, users: 20, channels: 8 },
    { title: 'Group 3', id: 6, users: 15, channels: 3 },
  ];

  requestAccess(groupTitle: string) {
    console.log(`Requesting access to ${groupTitle}`);
  }

  createGroup() {
    console.log('Creating a new group...');
  }
}
