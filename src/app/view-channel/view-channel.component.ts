import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { HttpClientModule } from '@angular/common/http';
import { tap, timestamp } from 'rxjs/operators';
import { ChannelServiceService } from '../services/channel-service.service';
import { io, Socket } from 'socket.io-client';
import { AuthService } from '../services/auth-service.service';


@Component({
  selector: 'app-view-channel',
  standalone: true,
  imports: [CommonModule, FormsModule, HttpClientModule],
  templateUrl: './view-channel.component.html',
})
export class ViewChannelComponent implements OnInit {
  channelId: string = '';
  groupId: string = '';
  messages: any[] = [];
  newMessage: string = '';
  channel: any = {};
  socket: Socket | null = null;


  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private channelService: ChannelServiceService,
    private authService: AuthService
  ) {}

  ngOnInit() {
    this.groupId = this.route.snapshot.paramMap.get('groupid') || '';
    this.channelId = this.route.snapshot.paramMap.get('channelid') || '';
    this.loadChannel()

      // Initialize socket.io client
  this.socket = io('http://localhost:4000'); // Adjust the URL if needed

  // Join the channel
  this.socket.emit('joinChannel', { channelId: this.channelId, userId: this.authService.getUser().id });

  // Listen for previous messages
  this.socket.on('previousMessages', (messages: any[]) => {
    this.messages = messages.map(message => {
      if (message.messageType !== 'text') {
        message.mediaRef = 'http://localhost:4000' + message.mediaRef;
      }
      return {
        ...message,
        incoming: message.sender._id !== this.authService.getUser()._id
      };
    });
  });

  // Listen for new messages
  this.socket.on('newMessage', (message: any) => {
    console.log("Message received", message);
    if (message.messageType !== 'text') {
      message.mediaRef = 'http://localhost:4000' + message.mediaRef;
    }
    message.incoming = message.sender._id !== this.authService.getUser()._id;
    this.messages.push(message);
  });
  }

  loadChannel() {
    this.channelService.getChannelDetails(this.channelId).subscribe((response: any) => {
      if (response.success) {
        this.channel = response.channel;
      }
    });
  }

  sendMessage() {
    if (this.newMessage.trim()) {
      const messageData = {
        userId: this.authService.getUser()._id,
        messageType: 'text',
        text: this.newMessage,
        mediaRef: null,
        channelId: this.channelId
      };
      this.socket?.emit('sendMessage', messageData);
      this.newMessage = '';
    }
  }
  

  toggleTimestamp(message: any) {
    message.showTimestamp = !message.showTimestamp;
  }

  goBack() {
    this.router.navigate([`/viewgroup`, this.groupId]);
  }

  onFileSelected(event: any) {
    const file: File = event.target.files[0];
    if (file) {
      this.uploadFile(file);
    }
  }
  
  uploadFile(file: File) {
    const formData = new FormData();
    formData.append('file', file);
    formData.append('messageType', 'image'); // Adjust if supporting other types
    formData.append('channelId', this.channelId);
  
    this.channelService.uploadFile(formData).subscribe(
      (response: any) => {
        if (response.success) {
          // The server will emit the new message via Socket.io
        }
      }
    );
  }

  incomingMessageStyle = {
    'background-color': '#2D3748', // Equivalent to Tailwind's bg-gray-800
    'color': '#FFFFFF',            // Tailwind's text-white
    'padding': '0.75rem',          // Tailwind's p-3
    'border-radius': '0.5rem',     // Tailwind's rounded-lg
    'max-width': '24rem',          // Tailwind's max-w-xs
    'margin-right': 'auto',        // Tailwind's mr-auto
    'margin-left': '0',             // Ensure left margin is reset
    'word-break': 'break-word'
  };

  outgoingMessageStyle = {
    'background-color': '#3182CE', // Tailwind's bg-blue-600
    'color': '#FFFFFF',            // Tailwind's text-white
    'padding': '0.75rem',          // Tailwind's p-3
    'border-radius': '0.5rem',     // Tailwind's rounded-lg
    'max-width': '24rem',          // Tailwind's max-w-xs
    'margin-left': 'auto',         // Tailwind's ml-auto
    'margin-right': '0',           // Ensure right margin is reset
    'word-break': 'break-word'

  };
  
}
