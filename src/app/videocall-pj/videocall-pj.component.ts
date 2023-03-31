import { Component, OnDestroy, OnInit, Renderer2, ViewChild } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
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

  startCallVisible = false;
  showForm = false;
  error = "";
  showLoading = false;

  constructor(private renderer: Renderer2, private userService: UserService, private visitService: VisitService, private activatedRoute: ActivatedRoute) {
    userService.getUserData().subscribe(resp => {
      if (resp.status == 200) {
        this.peer = new Peer(
          "peer" + resp.body.id_persona,
          {
            host: environment.apiLocation,
            port: 8080,
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
    this.visitService.stopVisit(this.visitID).subscribe();
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
    this.mediaConnection.close();
    this.visitService.stopVisit(this.visitID).subscribe();
    this.startCallVisible = true;
  }

  getPeerId() {
    return this.peer.id;
  }

  async call(peerId: string) {
    const stream = await this.getMediaStream();
    this.mediaConnection = this.peer.call(peerId, stream);

    this.mediaConnection.on('stream', (remoteStream: MediaStream) => {
      this.visitService.updateJoinTime(this.visitID).subscribe();
      this.visitService.startVisit(this.visitID).subscribe();

      this.startCallVisible = false;
      this.showLoading = false;
      this.showVideoStream(remoteStream);
    });

    this.mediaConnection.on('close', () => {
      this.stopRemoteVideo();
    });
  }

  getMediaStream() {
    return navigator.mediaDevices.getUserMedia({ video: true, audio: true });
  }

  setupForCall() {
    this.getMediaStream().then(stream => {
      const video = this.localVideo.nativeElement;
      this.renderer.setProperty(video, 'srcObject', stream);
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
      const stream = await this.getMediaStream();
      this.mediaConnection = call;
      this.mediaConnection.answer(stream);
      this.startCallVisible = false;

      this.mediaConnection.on('stream', (remoteStream: MediaStream) => {
        this.visitService.updateJoinTime(this.visitID).subscribe();
        this.visitService.startVisit(this.visitID).subscribe();

        this.showVideoStream(remoteStream);
      });

      this.mediaConnection.on('close', () => {
        this.stopRemoteVideo();
      });
    });
  }

  private stopRemoteVideo() {
    this.remoteVideo.nativeElement.pause();
    this.remoteVideo.nativeElement.removeAttribute('src');
    this.remoteVideo.nativeElement.load();
    this.startCallVisible = true;
  }

  private showVideoStream(remoteStream: MediaStream) {
    const video = this.remoteVideo.nativeElement;
    this.renderer.setProperty(video, 'srcObject', remoteStream);
    video.play();
  }
}
