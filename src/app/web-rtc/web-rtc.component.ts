import { Component, ElementRef, ViewChild, OnInit, OnDestroy } from '@angular/core';
import { CallService, PeerConnectionClient, PeerConnectionClientSettings, StreamService } from 'ngx-webrtc';
import * as io from 'socket.io-client';
 
@Component({
  selector: 'app-web-rtc',
  templateUrl: './web-rtc.component.html',
  styleUrls: ['./web-rtc.component.scss']
})
export class WebRTCComponent implements OnInit, OnDestroy {

 
  @ViewChild('localVideo', { static: false }) localVideo!: ElementRef;
  @ViewChild('remoteVideo', { static: false }) remoteVideo!: ElementRef;
 
  private socket: io.Socket;
  private pclient: PeerConnectionClient | undefined;
 
  constructor(
    private callService: CallService,
    private streamService: StreamService
  ) {
    this.socket = io.io('http://localhost:4000');
 
  }
 

 
  async ngOnInit() {
    const settings: PeerConnectionClientSettings = {
      peerConnectionConfig: {
        iceServers: [
          { urls: 'stun:stun.l.google.com:19302' },
          { urls: 'stun:stun.ekiga.net' },
          { urls: 'stun:stun.schlund.de' },
         ],
      }
    };
    this.pclient = await this.callService.createPeerClient(settings);
    const stream = await this.streamService.tryGetUserMedia();
    this.pclient.addStream(stream);
    this.streamService.setStreamInNode(this.localVideo.nativeElement, stream);
 
    this.socket.on('signal', (data: any) => {
      console.log('ehy ciaoo, sono nel on signal e sono un callee')
      this.pclient?.receiveSignalingMessage(data);
      this.pclient?.startAsCallee(data);
    });
 
    this.pclient.signalingMessage.subscribe((message) => {
      console.log('ehy ciaoo, sono nel emit signal')
      console.log(message)
 
      this.socket.emit('signal', message);
    });
    

 
    this.pclient.remoteStreamAdded.subscribe((stream) => {
      console.log('ehy ciaoo, sono nel remote stream')
      this.streamService.setStreamInNode(this.remoteVideo.nativeElement, stream.track);
    });
 
    this.socket.on('initiate', () => {
      console.log('sono il calleer')
      this.pclient?.startAsCaller();
      
    });
    

    this.socket.emit('join');
 
  }
 
  ngOnDestroy() {
    this.socket.disconnect();
  }
}