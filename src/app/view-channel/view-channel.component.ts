import { Component, OnDestroy, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { HttpClientModule } from '@angular/common/http';
import { tap, timestamp } from 'rxjs/operators';
import { ChannelServiceService } from '../services/channel-service.service';
import { io, Socket } from 'socket.io-client';
import { AuthService } from '../services/auth-service.service';
import { PeerService } from '../services/peer.service';



@Component({
  selector: 'app-view-channel',
  standalone: true,
  imports: [CommonModule, FormsModule, HttpClientModule],
  templateUrl: './view-channel.component.html',
})
export class ViewChannelComponent implements OnInit, OnDestroy {
  channelId: string = '';
  groupId: string = '';
  messages: any[] = [];
  newMessage: string = '';
  channel: any = {};
  socket: Socket | null = null;
  profilePictureUrl: string = 'http://localhost:4000/uploads/media/default.png';


  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private channelService: ChannelServiceService,
    private authService: AuthService,
    private peerService: PeerService,
  ) {}

  ngOnInit() {
    this.groupId = this.route.snapshot.paramMap.get('groupid') || '';
    this.channelId = this.route.snapshot.paramMap.get('channelid') || '';
    this.loadChannel()

      // Initialize socket.io client
  this.socket = io('http://localhost:4000'); // Adjust the URL if needed

      // Initialize peer service
      this.initializePeerConnection();

  // Join the channel
  this.socket.emit('joinChannel', { channelId: this.channelId, userId: this.authService.getUser().id });

  // Listen for previous messages
  this.socket.on('previousMessages', (messages: any[]) => {
    this.messages = messages.map(message => {
      console.log("Message type: ", message.messageType);
      if (message.messageType !== 'text') {
        message.mediaRef = 'http://localhost:4000' + message.mediaRef;
      }
      return {
        ...message,
        incoming: message.sender._id !== this.authService.getUser()._id
      };
    });
    this.scrollToBottom();
  });

  // Listen for new messages
  this.socket.on('newMessage', (message: any) => {
    if (message.messageType !== 'text') {
      message.mediaRef = 'http://localhost:4000' + message.mediaRef;
    }
    message.incoming = message.sender._id !== this.authService.getUser()._id;
    this.messages.push(message);
    this.scrollToBottom();
  });


  // Handle socket disconnect and navigate to viewgroup
  this.socket.on('disconnect', () => {
    this.router.navigate([`/viewgroup`, this.groupId]);
  });
  }

  ngOnDestroy() {
    // Disconnect socket when component is destroyed
    if (this.socket) {
      this.socket.disconnect();
    }
  }

  // Scroll to the bottom of the messages container
  scrollToBottom() {
    const messagesContainer = document.querySelector('.messages-container');
    setTimeout(() => {
      if (messagesContainer) {
        messagesContainer.scrollTop = messagesContainer.scrollHeight - messagesContainer.clientHeight;
      }
    }, 0);
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
    const fileType = file.type.split('/')[0]; // Get the type of the file (e.g., 'image', 'video', 'audio')
  
    // Check if the file type is one of the supported types (image, video, audio)
    if (fileType === 'image' || fileType === 'video' || fileType === 'audio') {
      formData.append('file', file);
      formData.append('messageType', fileType); // Set messageType to 'image', 'video', or 'audio'
      formData.append('channelId', this.channelId);
  
      this.channelService.uploadFile(formData).subscribe((response: any) => {
        if (response.success) {
          // The server will emit the new message via Socket.io
        }
      });
    } else {
      console.error('Unsupported file type. Please upload an image, video, or audio file.');
    }
  }
  
  
  async initializePeerConnection() {
    try {
      const userStream = await navigator.mediaDevices.getUserMedia({ video: true, audio: true });
      
      // Set the local video stream
      const localVideoElement = document.querySelector('#localVideo') as HTMLVideoElement;
      if (localVideoElement) {
        localVideoElement.srcObject = userStream;
      }
  
      // Broadcast this user's Peer ID to all other users in the channel
      this.socket?.emit('peerConnected', { peerId: this.peerService.getPeerId(), channelId: this.channelId });
  
      // Call all other users in the channel (you might need to fetch other peer IDs from the server if not already present)
      this.socket?.on('peerConnected', ({ peerId }) => {
        if (peerId !== this.peerService.getPeerId()) {
          this.peerService.makeCall(peerId, userStream);
        }
      });
    } catch (error) {
      console.error('Error initializing peer connection:', error);
    }
  }
  
  
}
