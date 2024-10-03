import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { HttpClientModule } from '@angular/common/http';
import { tap } from 'rxjs/operators';

interface Message {
  text: string;
  timestamp: string;
  incoming: boolean;
  showTimestamp: boolean;
}

@Component({
  selector: 'app-view-channel',
  standalone: true,
  imports: [CommonModule, FormsModule, HttpClientModule],
  templateUrl: './view-channel.component.html',
})
export class ViewChannelComponent implements OnInit {
  channelId: string = '';
  groupId: string = '';
  messages: Message[] = [];
  newMessage: string = '';

  constructor(
    private route: ActivatedRoute,
    private router: Router,
  ) {}

  ngOnInit() {
    this.groupId = this.route.snapshot.paramMap.get('groupid') || '';
    this.channelId = this.route.snapshot.paramMap.get('channelid') || '';
  }

  sendMessage() {
    if (this.newMessage.trim()) {
      
    }
  }

  toggleTimestamp(message: Message) {
    message.showTimestamp = !message.showTimestamp;
  }

  goBack() {
    this.router.navigate([`/viewgroup`, this.groupId]);
  }
}
