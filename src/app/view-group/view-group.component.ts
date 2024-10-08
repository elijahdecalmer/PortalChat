import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { HttpClientModule } from '@angular/common/http';
import { GroupServiceService } from '../services/group-service.service';
import { AuthService } from '../services/auth-service.service';

@Component({
  selector: 'app-view-group',
  standalone: true,
  imports: [CommonModule, HttpClientModule],
  templateUrl: './view-group.component.html',
})
export class ViewGroupComponent implements OnInit {
  groupId: string = '';
  group: any = {};

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private groupService: GroupServiceService,
    private authService: AuthService
  ) {}

  ngOnInit() {
    this.groupId = this.route.snapshot.paramMap.get('groupid') || '';
    this.loadGroupDetails();

  }

  loadGroupDetails() {
    this.groupService.getGroupDetails(this.groupId).subscribe((response: any) => {
      if (response.success) {
        this.group = response.group;
      }
    });
  
  }

  navigateToChannel(channel: any) {
    this.router.navigate([`/viewchannel`, this.groupId, channel._id]);
  }

  leaveGroup() {
    this.groupService.leaveGroup(this.groupId).subscribe((response: any) => {
      if (response.success) {
        this.router.navigate(['/browsegroups']);
        this.authService.refetchUser().subscribe((user) => {
    
        });
      }
    });
  }
}
