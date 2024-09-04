import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { HttpClientModule } from '@angular/common/http';

interface User {
  name: string;
  bio: string;
  isAdmin: boolean;
}

@Component({
  selector: 'app-view-group',
  standalone: true,
  imports: [CommonModule, HttpClientModule],
  templateUrl: './view-group.component.html',
})
export class ViewGroupComponent implements OnInit {
  groupId: string = '';
  channels = [
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

  members: User[] = [
    { name: 'Alice Johnson', bio: 'Loves coding and coffee', isAdmin: true },
    { name: 'Bob Smith', bio: 'JavaScript enthusiast', isAdmin: false },
    { name: 'Charlie Davis', bio: 'Front-end developer', isAdmin: false },
    { name: 'Dana White', bio: 'Group lead and architect', isAdmin: true },
  ];

  constructor(private route: ActivatedRoute, private router: Router) {}

  ngOnInit() {
    this.groupId = this.route.snapshot.paramMap.get('groupid') || '';
  }

  navigateToChannel(channel: any) {
    this.router.navigate([`/viewchannel`, this.groupId, channel.id]);
  }

  leaveGroup() {
    console.log('Leaving group... TODO IMPLEMENT THIS FuNCOTIJKN ');
  }
}
