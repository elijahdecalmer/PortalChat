import { Injectable } from '@angular/core';
import Peer from 'peerjs';
import { Subject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class PeerService {
  private peer: Peer;
  private peerId: string | null = null;
  public onRemoteStreamReceived: Subject<MediaStream> = new Subject<MediaStream>();

  constructor() {
    this.peer = new Peer({
      host: 'localhost',
      port: 4000,
      path: '/peerjs',
      secure: false // Set to true if using HTTPS
    });

    this.peer.on('open', (id: string) => {
      this.peerId = id;
      console.log('My peer ID is: ' + this.peerId);
    });

    this.peer.on('call', (call) => {
      navigator.mediaDevices.getUserMedia({ video: true, audio: true })
        .then((stream) => {
          call.answer(stream); // Answer the call with our stream
          call.on('stream', (remoteStream) => {
            this.handleRemoteStream(remoteStream);
            this.onRemoteStreamReceived.next(remoteStream);
          });
        })
        .catch(err => console.error('Failed to get local stream', err));
    });
  }

  makeCall(peerId: string, stream: MediaStream) {
    const call = this.peer.call(peerId, stream);
    call.on('stream', (remoteStream) => {
      this.handleRemoteStream(remoteStream);
      this.onRemoteStreamReceived.next(remoteStream);
    });
  }

  private handleRemoteStream(stream: MediaStream) {
    const remoteVideoElement = document.querySelector('#remoteVideo') as HTMLVideoElement;
    if (remoteVideoElement) {
      remoteVideoElement.srcObject = stream;
    }
  }

  getPeerId() {
    return this.peerId;
  }

  destroyPeer() {
    if (this.peer) {
      this.peer.disconnect();
      this.peer.destroy();
      this.peerId = null;
      this.onRemoteStreamReceived.complete();
    }
  }
}
