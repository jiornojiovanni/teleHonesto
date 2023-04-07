import { Component, NgZone, OnDestroy, OnInit, Renderer2, ViewChild } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import Peer, { MediaConnection } from 'peerjs';
import { environment } from 'src/environments/environment';
import { UserService } from '../user/user.service';
import { VisitService } from '../visit/visit.service';

@Component({
  selector: 'app-videocall-pj',
  templateUrl: './videocall-pj.component.html',
  styleUrls: ['./videocall-pj.component.scss'],
})
export class VideocallPJComponent implements OnDestroy, OnInit{

  @ViewChild('remoteVideo') remoteVideo?: any;
  @ViewChild('localVideo') localVideo?: any;

  visitID = this.activatedRoute.snapshot.params["visitId"];
  peer!: Peer;
  mediaConnection!: MediaConnection;
  stream!: MediaStream;
  localStream!: MediaStream;
  showForm = false;
  error = "";
  showLoading = false;
  callWasStarted = false;

  isMicEnabled = true;
  isVideoEnabled = true;

  constructor(private zone: NgZone, private router: Router, private renderer: Renderer2, private userService: UserService, private visitService: VisitService, private activatedRoute: ActivatedRoute) {
    userService.getUserData().subscribe(resp => {
      if (resp.status == 200) {
        this.peer = new Peer(
          "peer" + resp.body.id_persona,
          {
            host: environment.apiLocation,
            port: Number(environment.apiPort),
            path: '/connect',
            secure: true
          });

        if (resp.body.tipo == "medico") {
          this.showForm = true;
        }
        this.setupForCall();

      }
    });
  }

  ngOnDestroy(): void {
    this.peer.destroy();
    if(this.callWasStarted) {
      this.visitService.stopVisit(this.visitID).subscribe();
    }
  }

  ngOnInit(): void {
    this.startCall();
  }

  startCall() {
    this.visitService.getVisitPartecipants(this.visitID).subscribe(resp => {
      if (resp.status == 200) {
        this.call("peer" + resp.body.fk_persona);
        this.showLoading = true;
      }
    });
  }

  endCall() {
    if(this.mediaConnection != undefined) {
      this.mediaConnection.close();
      this.visitService.stopVisit(this.visitID).subscribe();
    }
    this.router.navigateByUrl('profile');
  }

  muteAudio() {
    this.isMicEnabled = !this.isMicEnabled;
    this.stream.getAudioTracks()[0].enabled = this.isMicEnabled;
  }

  muteVideo() {
    this.isVideoEnabled = !this.isVideoEnabled;
    this.stream.getVideoTracks()[0].enabled = this.isVideoEnabled;
    this.localStream.getVideoTracks()[0].enabled = this.isVideoEnabled;
  }

  getPeerId() {
    return this.peer.id;
  }

  async call(peerId: string) {
    this.stream = await this.getMediaStream();
    this.mediaConnection = this.peer.call(peerId, this.stream, {metadata: {visit: this.visitID}});

    this.mediaConnection.on('stream', (remoteStream: MediaStream) => {
      this.visitService.updateJoinTime(this.visitID).subscribe();
      this.visitService.startVisit(this.visitID).subscribe();
      this.callWasStarted = true;
      this.showLoading = false;
      this.showVideoStream(remoteStream);
    });

    this.mediaConnection.on('close', () => {
      this.stopRemoteVideo();

      this.zone.run(() => {
        this.router.navigateByUrl('profile');
      });
    });
  }

  getMediaStream() {
    return navigator.mediaDevices.getUserMedia({ video: true, audio: true });
  }

  setupForCall() {
    this.getMediaStream().then(stream => {
      this.localStream = stream;
      const video = this.localVideo.nativeElement;
      this.renderer.setProperty(video, 'srcObject', this.localStream);
      video.play();
    });

    this.peer.on('error', (err: any) => {
      console.log(err.type);
      this.showLoading = false;
      if(err.type == 'peer-unavailable')
        this.startCall();
        this.showLoading = true;
    });

    this.peer.on('call', async (call: MediaConnection) => {
      this.stream = await this.getMediaStream();
      this.mediaConnection = call;

      //If the visit id of the call does not correspond to the current visit id we do not answer because it's a different visit.
      if(this.mediaConnection.metadata.visit != this.visitID)
        return;

      this.mediaConnection.answer(this.stream);

      this.mediaConnection.on('stream', (remoteStream: MediaStream) => {
        this.visitService.updateJoinTime(this.visitID).subscribe();
        this.visitService.startVisit(this.visitID).subscribe();
        this.callWasStarted = true;

        this.showVideoStream(remoteStream);
      });

      this.mediaConnection.on('close', () => {
        this.stopRemoteVideo();
        this.zone.run(() => {
          this.router.navigateByUrl('profile');
        });
      });
    });
  }

  private stopRemoteVideo() {
    this.remoteVideo.nativeElement.pause();
    this.remoteVideo.nativeElement.removeAttribute('src');
    this.remoteVideo.nativeElement.load();
  }

  private showVideoStream(remoteStream: MediaStream) {
    const video = this.remoteVideo.nativeElement;
    this.renderer.setProperty(video, 'srcObject', remoteStream);
    video.play();
  }
}
