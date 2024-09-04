import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { HttpClientModule } from '@angular/common/http';
import { AuthService } from '../auth.service';

interface User {
  username: string;
  email: string;
  groups?: any[];
  id: number;
  roles: string[];
  reported: boolean;
}

interface Channel {
  title: string;
  id: number;
  chats: number;
  lastMessage: string;
  lastMessageTime: string;
  unreadMessages: number;
}

@Component({
  selector: 'app-view-group',
  standalone: true,
  imports: [CommonModule, HttpClientModule],
  templateUrl: './view-group.component.html',
})
export class ViewGroupComponent implements OnInit {
  groupId: string = '';
  channels: Channel[] = [];
  members: User[] = [];
  user: User | null = null;

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private authService: AuthService
  ) {}

  ngOnInit() {
    this.groupId = this.route.snapshot.paramMap.get('groupid') || '';
    this.loadGroupDetails();
    this.authService.user.subscribe((user) => {
      this.user = user;
    });
  }

  loadGroupDetails() {
    // This method should fetch the group details, including channels and members.
    // For now, we will simulate loading channels and members.
    this.channels = [
      {
        title: 'Channel 1',
        id: 1,
        chats: 10,
        lastMessage: 'Hello, how are you?',
        lastMessageTime: '2 hours ago',
        unreadMessages: 5,
      },
      {
        title: 'Channel 2',
        id: 2,
        chats: 20,
        lastMessage: 'Meeting at 3 PM',
        lastMessageTime: '1 day ago',
        unreadMessages: 0,
      },
      {
        title: 'Channel 3',
        id: 3,
        chats: 15,
        lastMessage: 'Check out this link',
        lastMessageTime: '3 days ago',
        unreadMessages: 2,
      },
    ];

    // Simulated members load, replace with actual service call if needed
    this.members = [
      {
        username: 'User 1',
        email: 'eergger@gmail.com',
        id: 1,
        roles: [],
        reported: false,
      },
      {
        username: 'User 2',
        email: 'sdgfds@gmail.com',
        id: 2,
        roles: [],
        reported: false,
      },
      {
        username: 'User 3',
        email: 'dfjdkjfhskdf;@gmail.com',
        id: 3,
        roles: [],
        reported: false,
      },
    ];
  }

  navigateToChannel(channel: Channel) {
    this.router.navigate([`/viewchannel`, this.groupId, channel.id]);
  }

  leaveGroup() {
    this.authService
      .removeUserFromGroup(Number(this.groupId), Number(this?.user?.id))
      .subscribe(
        () => {
          console.log('Successfully left the group');
          this.router.navigate(['/browsegroups']);
        },
        (error) => {
          console.error('Error leaving group:', error);
        }
      );
  }
}
