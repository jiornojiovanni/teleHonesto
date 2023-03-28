import { Component, ElementRef, ViewChild, OnInit, OnDestroy, ComponentRef } from '@angular/core';
import { CallService, DeviceService, PeerConnectionClient, PeerConnectionClientSettings, StreamService, StreamType } from 'ngx-webrtc';
import { first } from 'rxjs/operators';
import { io, Socket } from "socket.io-client";
import { environment } from 'src/environments/environment';
export enum MessageType {
  Server = 'server',
  Text = 'text',
  Signal = 'signal'
}

export interface Message {
  type: MessageType;
  author: string;
  message: string;
  time: number;
  room: string;
  for?: string;
}
export interface ServerMessage extends Message {
  id: string;
}
@Component({
  selector: 'app-web-rtc',
  templateUrl: './web-rtc.component.html',
  styleUrls: ['./web-rtc.component.scss']
})
export class WebRTCComponent implements OnInit, OnDestroy {

 
  @ViewChild('localVideo', { static: false }) localStreamNode!: ElementRef;
  @ViewChild('remoteVideo', { static: false }) remoteStreamNode!: ElementRef;
 
  public pclients: {connection: PeerConnectionClient}[] = [];
  private socket: Socket;

  private isInitiator = false;
  private localStream: MediaStream | null = null;

  
  
  constructor(
    private callService: CallService,
    private deviceService: DeviceService,
    private streamService: StreamService,
  ) {
    this.socket = io("https://" + environment.apiLocation + ":8080");
  }
 
  private onLocalStream(stream: MediaStream): void {
    console.log("onLocalStream", stream);

    this.streamService.setLocalStream(stream);

    this.socket.emit('joined');
    this.callService.start();
  }

  private onNoStream(): void {

    const emptyStream = new MediaStream();
    this.streamService.setLocalStream(emptyStream);

    this.socket.emit('joined');
    this.callService.start();
  }
 
  async ngOnInit() {
    this.deviceService.tryGetMedia(this.onLocalStream.bind(this), this.onNoStream.bind(this));
    const settings: PeerConnectionClientSettings = {
      peerConnectionConfig: {
        iceServers: [
          { urls: 'stun:stun.l.google.com:19302' },
          { urls: 'stun:stun.ekiga.net' },
          { urls: 'stun:stun.schlund.de' },
         ],
      }
    };

    this.socket.on('private-message', (message: ServerMessage) => {
      console.log('private-message', message.type);

      for (const client of this.pclients) {

          client.connection.receiveSignalingMessage(message.message);

      }
    });

    this.streamService.replaceTrack$.subscribe((track: MediaStreamTrack | null) => {
      console.log('replaceTrack', track);
      if (track) {
        if (track.kind === StreamType.Video && this.localStream?.getVideoTracks().length) {
            this.pclients.forEach(async client => {
              client.connection.replaceTrack(track);
            });
          } else {
            this.pclients.forEach(async client => {
              client.connection.addTrack(track);
            });
        }
      } else {
        // this.log('WARNING: track is null');
      }
    });

    this.streamService.localStream$.subscribe((stream) => {
      console.log("localStream$", stream);
      if (stream) {
        const nodeStream: MediaStream | null = this.localStreamNode.nativeElement.srcObject as MediaStream;

        if (stream.getTracks().length && stream != nodeStream) {
          this.streamService.setStreamInNode(this.localStreamNode.nativeElement, stream, true, true);
        }
        this.localStream = stream;
      }
    });

 

    this.socket.on('userJoinedRoom', async (data: any) => {
      console.log("userJoinedRoom",data);

      if (data > 1) {

        if (data > 2 && this.pclients.length) {
          this.isInitiator = true;
        }

        const connection = await this.addPeer();
        this.pclients.push({
          connection,
        });
        this.callService.addUser({name: 'Admin' + Math.random(), socketId: ''}, connection);

      } else {
        this.isInitiator = true;
      }
      console.log("iniziatore",this.isInitiator);
    });
 

    
    

    this.socket.emit('join');

 
  }

  private async addPeer(): Promise<PeerConnectionClient> {

    const cert = await this.callService.createCertifcate();
    const settings: PeerConnectionClientSettings = {
      peerConnectionConfig: {
        iceServers: [
          { urls: 'stun:stun.l.google.com:19302' },
          { urls: 'stun:stun.ekiga.net' },
          { urls: 'stun:stun.schlund.de' },
         ]
      }
    };
    const pclient = await this.callService.createPeerClient(settings);

    // add media
    console.log("localStream", this.localStream);

    if (this.localStream) {
      pclient.addStream(this.localStream);
    }


    pclient.signalingMessage.subscribe(m => {
      console.log('signalingMessage');
      setTimeout(() => {

        this.socket.emit('message', {
          type: 'signal',
          for: '',
          message: JSON.stringify(m)
        });
      }, 3000);
    });

    pclient.remoteTrackAdded.subscribe(track => {
      console.log("remoteTrackAdded");
      if (track.kind === StreamType.Video) {
        this.streamService.setStreamInNode(this.remoteStreamNode.nativeElement, track.track);
      }
    });


    if (this.localStream && this.localStream.getTracks().length) {
      console.log("negotiate");
      pclient.negotiationNeededTriggered.pipe(
        first(),
      ).subscribe(() => {
        this.startPeerConnection(pclient);
      });
    } else {
      this.startPeerConnection(pclient);
    }
    



    return pclient;
  }

  // private startPeerConnection(pclient: PeerConnectionClient): void {
    
  //   if (this.isInitiator) {
  //     console.log("startAsCaller",this.isInitiator)
  //     pclient.startAsCaller();
      
  //   } else {
  //     console.log("startAsCallee",this.isInitiator)
  //       pclient.startAsCallee();
  //   }

  // }
  private startPeerConnection(pclient: PeerConnectionClient): void {
    if (this.isInitiator) {
      pclient.startAsCaller();
      // this.log('start as caller');
      console.log("startAsCaller");
    } else {
      pclient.startAsCallee();
    }

    pclient.negotiationNeededTriggered.subscribe(() => {
      pclient.createOffer();
    });
  }
 
  ngOnDestroy() {
    this.socket.disconnect();
  }
}