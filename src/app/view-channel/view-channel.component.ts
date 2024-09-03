import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

interface Message {
  text: string;
  timestamp: string;
  incoming: boolean;
  showTimestamp: boolean;
}

@Component({
  selector: 'app-view-channel',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './view-channel.component.html',
})
export class ViewChannelComponent implements OnInit {
  channelId: string = '';
  groupId: string = '';
  messages: Message[] = [
    {
      text: 'Hello, how are you?',
      timestamp: '2024-09-03 10:30:00',
      incoming: true,
      showTimestamp: false,
    },
    {
      text: 'I am fine, thanks!',
      timestamp: '2024-09-03 10:32:00',
      incoming: false,
      showTimestamp: false,
    },
    {
      text: 'I am fine, thanks!',
      timestamp: '2024-09-03 10:32:00',
      incoming: false,
      showTimestamp: false,
    },
    {
      text: 'I am fine, thanks!',
      timestamp: '2024-09-03 10:32:00',
      incoming: false,
      showTimestamp: false,
    },
  ];

  newMessage: string = '';

  constructor(private route: ActivatedRoute, private router: Router) {}

  ngOnInit() {
    this.groupId = this.route.snapshot.paramMap.get('groupid') || '';
    this.channelId = this.route.snapshot.paramMap.get('channelid') || '';
  }

  sendMessage() {
    if (this.newMessage.trim()) {
      this.messages.push({
        text: this.newMessage,
        timestamp: new Date().toISOString(),
        incoming: false,
        showTimestamp: false,
      });
      this.newMessage = '';
    }
  }

  toggleTimestamp(message: Message) {
    message.showTimestamp = !message.showTimestamp;
  }

  goBack() {
    this.router.navigate([`/viewgroup`, this.groupId]);
  }
}
