import { Component, ElementRef, ViewChild, OnInit, OnDestroy, ComponentRef } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { DefaultEventsMap } from '@socket.io/component-emitter';
import { CallService, DeviceService, PeerConnectionClient, PeerConnectionClientSettings, StreamService, StreamType } from 'ngx-webrtc';
import { first } from 'rxjs/operators';
import { io, Socket } from "socket.io-client";
import { UserService } from '../user/user.service';
import { VisitService } from '../visit/visit.service';

import { environment } from 'src/environments/environment';
import { User } from '../user';
import { DocumentService } from '../document/document.service';
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
export class WebRTCComponent implements OnDestroy , OnInit{


  @ViewChild('localVideo', { static: false }) localStreamNode!: ElementRef;
  @ViewChild('remoteVideo', { static: false }) remoteStreamNode!: ElementRef;
  @ViewChild('audioStreamNode', { static: false }) public audioStreamNode!: ElementRef;

  public pclients: {connection: PeerConnectionClient}[] = [];
  private socket: Socket;

  private isInitiator = false;
  private localStream: MediaStream | null = null;
  private room: Socket<DefaultEventsMap, DefaultEventsMap> | undefined;
  private mute= false;
  private visible= false;
 VideoAdded=false;
  started =false;
  doctor= false;
  navOpen=false;
  user: any;
  title = "";
  text = "";
 


  constructor(
    private callService: CallService,
    private deviceService: DeviceService,
    private streamService: StreamService,
    private visitService: VisitService,
    private activatedRoute: ActivatedRoute,
    private userService: UserService,
    private documentService: DocumentService
  ) {
    this.socket = io("https://" + environment.apiLocation + ":8080");
  }
   nav(): void {
    if(this.navOpen == true){
    this.navOpen=false;
    const nav = document.getElementById("mySidebar");
    const n2= document.getElementById("main");
    nav!.style.width= '0%';
    n2!.style.width= '100%';}
    else{
    this.navOpen=true;
    const nav = document.getElementById("mySidebar");
    const n2= document.getElementById("main");
    nav!.style.width= '20%';
    nav!.style.right='1%';
    n2!.style.width= '80%';
    }
  }

  ngOnInit(): void {
    this.room =this.activatedRoute.snapshot.params["visitId"];

    this.userService.getUserData().subscribe(resp => {
      if(resp.status == 200) {
        this.user = new User(resp.body.nome, resp.body.cognome, resp.body.email, resp.body.id_persona, resp.body.tipo);
        if(resp.body.tipo == "medico"){
          console.log("Medico");
          this.doctor=true;
        }
      }
      
      
    });
    
    this.deviceService.tryGetMedia(this.onLocalStream.bind(this), this.onNoStream.bind(this));
  }
  muted(): void {

    if(this.mute){
      this.streamService.enableLocalTrack(StreamType.Audio);
      this.mute=!this.mute;
    }else{
    this.streamService.disableLocalTrack(StreamType.Audio);
    this.mute=!this.mute;
    }
  }
  disablevideo(): void {
    if(this.visible){
      this.streamService.enableLocalTrack(StreamType.Video);
      this.visible=!this.visible;
    }else{
    this.streamService.disableLocalTrack(StreamType.Video);
    this.visible=!this.visible;
    }
  }


  private onLocalStream(stream: MediaStream): void {
    console.log("onLocalStream", stream);
    this.streamService.setStreamInNode(this.localStreamNode.nativeElement, stream, true, true);
    this.streamService.setLocalStream(stream);
    if(this.started){
    this.socket.emit('joined', this.room);
    this.callService.start();
    }
  }

  private onNoStream(): void {

    const emptyStream = new MediaStream();
    this.streamService.setLocalStream(emptyStream);

  }

  public endCall(): void{
    this.started=false;
    this.callService.users$.next([]);
    this.streamService.stopStreamInNode(this.localStreamNode.nativeElement);
    this.streamService.setLocalStream(null);
    if (this.pclients && this.pclients.length) {
      this.pclients.forEach(client => {
        client.connection.close();
      });
    }
    this.pclients = [];
    this.callService.updateSince();
    this.callService.stop();
    this.socket.disconnect();
    this.navOpen=true;
    this.nav();
  }

  public startCall(): void {
    this.started=true;
    if(this.socket.disconnected){
      this.socket.connect();
    }
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


    this.socket.emit('join', this.room);

    this.socket.on('private-message', (message: ServerMessage) => {
      console.log('private-message', message.type);

      for (const client of this.pclients) {

          client.connection.receiveSignalingMessage(message.message);

      }
    });

    this.streamService.replaceTrack$.subscribe((track: MediaStreamTrack | null) => {
      console.log('replaceTrack', track);
      if (track) {
        if (track.kind === StreamType.Audio && this.localStream?.getAudioTracks().length || track.kind === StreamType.Video && this.localStream?.getVideoTracks().length) {
            this.pclients.forEach(async client => {
              client.connection.replaceTrack(track);
            });
           
          } else {
            this.pclients.forEach(async client => {
              client.connection.addTrack(track);
            });
        }
      } else {
         console.log('WARNING: track is null');
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

        this.socket.emit('message',  this.room,{
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
        this.VideoAdded =true;
      }
      if (track.kind === StreamType.Audio) {
        this.streamService.setStreamInNode(this.audioStreamNode.nativeElement, track.track, false);
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

  submit() {
    const tipoAnamnesi = 2;
    this.documentService.saveDocument(this.title, this.text, this.activatedRoute.snapshot.params["visitId"], tipoAnamnesi).subscribe(resp => {
      if (resp.status == 200) {
        window.open("https://" + environment.apiLocation + ":8080" + resp.body.uri, "_blank");
      }
    });
  }
}
