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
export class VideocallPJComponent implements OnDestroy{

  @ViewChild('remoteVideo') remoteVideo?: any;
  @ViewChild('localVideo') localVideo?: any;

  visitID = this.activatedRoute.snapshot.params["visitId"];
  peer!: Peer;
  mediaConnection!: MediaConnection;
  peerConnection!: RTCPeerConnection;
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
          "peer" + resp.body.id_persona + this.visitID,
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

  startCall() {
    this.visitService.getVisitPartecipants(this.visitID).subscribe(resp => {
      if (resp.status == 200) {
        this.call("peer" + resp.body.fk_persona + this.visitID);
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
    this.mediaConnection = this.peer.call(peerId, this.stream);
    this.peerConnection = this.mediaConnection.peerConnection;
    //This gets called two times thanks to a library bug, ignore the browser errors https://github.com/peers/peerjs/issues/609
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
    this.getMediaStream().then(async stream => {
      this.localStream = stream;
      const video = this.localVideo.nativeElement;
      this.renderer.setProperty(video, 'srcObject', this.localStream);
      await video.play();
    });

    this.peer.on('error', (err: any) => {
      console.log(err.type);
      this.showLoading = false;
      if(err.type == 'peer-unavailable')
        this.startCall();
        this.showLoading = true;
    });

    this.peer.on('open',  () => {
      this.startCall();
    });

    this.peer.on('call', async (call: MediaConnection) => {
      this.stream = await this.getMediaStream();
      this.mediaConnection = call;
      this.mediaConnection.answer(this.stream);
      this.peerConnection = this.mediaConnection.peerConnection;
      //This gets called two times thanks to a library bug, ignore the browser errors https://github.com/peers/peerjs/issues/609
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

  private async showVideoStream(remoteStream: MediaStream) {
    const video = this.remoteVideo.nativeElement;
    this.renderer.setProperty(video, 'srcObject', remoteStream);
    await video.play();
  }
}
