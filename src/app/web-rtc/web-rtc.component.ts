import { Component, ElementRef, ViewChild } from '@angular/core';
import { CallService, PeerConnectionClientSettings, StreamService } from 'ngx-webrtc';

@Component({
  selector: 'app-web-rtc',
  templateUrl: './web-rtc.component.html',
  styleUrls: ['./web-rtc.component.scss']
})
export class WebRTCComponent {

  @ViewChild('videoStreamNodePeer1', { static: false }) videoStreamNodePeer1!: ElementRef;
  @ViewChild('videoStreamNodePeer2', { static: false }) videoStreamNodePeer2!: ElementRef;

  roomId: any;

  constructor(
    private callService: CallService,
    private streamService: StreamService
  ) {}

  
  async answerCall() {
    const stream = await this.streamService.tryGetUserMedia();
    const settings = {
     peerConnectionConfig: {
       iceServers: [
         { urls: 'stun:stun.l.google.com:19302' },
         { urls: 'stun:stun.ekiga.net' },
         { urls: 'stun:stun.schlund.de' },
        ],
     }
   };
    const pclient = await this.callService.createPeerClient(settings);
    pclient.addStream(stream);
    pclient.remoteStreamAdded.subscribe(stream => {
      this.streamService.setStreamInNode(this.videoStreamNodePeer1.nativeElement, stream.track);
    });
    pclient.startAsCallee();
    
  }

  async makeCall() {
    const stream = await this.streamService.tryGetUserMedia();
    const settings = {
     peerConnectionConfig: {
       iceServers: [
         { urls: 'stun:stun.l.google.com:19302' },
         { urls: 'stun:stun.ekiga.net' },
         { urls: 'stun:stun.schlund.de' },
        ],
     }
   };
    const pclient = await this.callService.createPeerClient(settings);
    pclient.addStream(stream);
    pclient.remoteStreamAdded.subscribe(stream => {
      this.streamService.setStreamInNode(this.videoStreamNodePeer1.nativeElement, stream.track);
    });
    pclient.startAsCaller();
    // Inserisci qui il codice per avviare la chiamata, ad esempio inviando una richiesta al server per avviare la connessione con il destinatario.
  }
}




