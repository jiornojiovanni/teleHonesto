import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { CallService, PeerConnectionClient, PeerConnectionClientSettings, StreamService, StreamType } from 'ngx-webrtc';
import * as io from 'socket.io-client';


@Component({
  selector: 'app-webrtc',
  templateUrl: './webrtc.component.html',
  styleUrls: ['./webrtc.component.scss']
})
export class WebrtcComponent implements OnInit {
  socket;
  peerClient!: PeerConnectionClient;
  @ViewChild('videoElement', { static: false }) videoElement!: ElementRef;

  constructor(private callService: CallService, private streamService: StreamService) {
    this.socket = io.io("ws://localhost:5000");
  }

  async ngOnInit() {
    const settings: PeerConnectionClientSettings = {
      peerConnectionConfig: {
        iceServers: [
          { urls: 'stun:stun.l.google.com:19302' },
         { urls: 'stun:stun.ekiga.net' },
         { urls: 'stun:stun.schlund.de' },
         ],
      },
      debug: true
    };
    this.peerClient = await this.callService.createPeerClient(settings);

    this.socket.on('message', m => {
      this.peerClient.receiveSignalingMessage(m);
    });

    this.peerClient.signalingMessage.subscribe((m: any) => {
      this.socket.emit('message', m);
    });

    this.socket.on('start', async m => {
      this.peerClient.startAsCallee();
      const stream = await this.streamService.tryGetUserMedia();
      this.peerClient.addStream(stream);
    });

    this.peerClient.remoteTrackAdded.subscribe((track: { kind: StreamType; track: MediaStream | MediaStreamTrack; }) => {

      if (track.kind === StreamType.Video) {
        this.streamService.setStreamInNode(this.videoElement.nativeElement, track.track);
      }
    });

    this.peerClient.negotiationNeededTriggered.subscribe(() => {
      this.peerClient.createOffer();
    });
  }

  async click() {
    this.socket.emit('start');
    const stream = await this.streamService.tryGetUserMedia();
    this.peerClient.addStream(stream);
    this.callService.start();
    this.peerClient.startAsCaller();
  }
}
