import { Component, Renderer2, ViewChild } from '@angular/core';
import Peer from 'peerjs';
import { environment } from 'src/environments/environment';

@Component({
  selector: 'app-videocall-pj',
  templateUrl: './videocall-pj.component.html',
  styleUrls: ['./videocall-pj.component.scss'],
})
export class VideocallPJComponent {
  @ViewChild('videoElement') videoElement?: any;

  getId() {
    return this.peer.id;
  }

  startCall() {
    this.call(this.peerId);
  }

  peerId: any;
  peer: Peer;

  constructor(private renderer: Renderer2) {
    this.peer = new Peer({
      host: environment.apiLocation,
      port: 8080,
      path: '/connect',
      secure: true
    });

    this.setupForCall();
  }

  getPeerId(): string {
    return this.peer.id;
  }

  async call(peerId: string) {
    const stream = await this.getMediaStream();
    const othercall = this.peer.call(peerId, stream);

    othercall.on('stream', (remoteStream) => {
      this.showVideoStream(remoteStream);
    });
  }

  getMediaStream() {
    return navigator.mediaDevices.getUserMedia({ video: true, audio: true });
  }

  setupForCall() {
    this.peer.on('call', async (call) => {
      const stream = await this.getMediaStream();
      call.answer(stream);

      call.on('stream', (remoteStream) => {
        this.showVideoStream(remoteStream);
      });
    });
  }

  private showVideoStream(remoteStream: MediaStream) {
    const video = this.videoElement.nativeElement;
    this.renderer.setProperty(video, 'srcObject', remoteStream);
    video.play();
  }
}
